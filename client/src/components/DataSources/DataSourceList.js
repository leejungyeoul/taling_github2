import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import axios from "axios";
import Swal from 'sweetalert2'

class DataSourceList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            responseDatsSourceList: '',//swtool 리스트 response 변수
            append_DatsSourceList: '', //swtool 리스트 append 변수
        }
    }

    componentDidMount() {
        // SW Tool 리스트 호출
        this.callDataSourceListApi()
    }

    // datasource 리스트 호출
    callDataSourceListApi = async () => {
        //SW Tool List 호출
        axios.post('/api/DataSource?type=list', {
        })
        .then( response => {
            try {
                this.setState({ responseDatsSourceList: response });
                this.setState({ append_DatsSourceList: this.DatoSourceListAppend() });
            } catch (error) {
                this.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기')
            }
        })
        .catch( error => {this.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기');return false;} );
    }

    // datasource 리스트 append
    DatoSourceListAppend = () => {
        let result = []
        var DatasourcList = this.state.responseDatsSourceList.data
        
        for(let i=0; i<DatasourcList.json.length; i++){
            var data = DatasourcList.json[i]
            var detail_url = '/data-src-view/'+data.ds_code

            var imgpath = '/image/'+data.ds_big_imgpath

            result.push(
                <li>
                    <figure><img src={imgpath} alt="" /></figure>
                    <h3>{data.ds_dbname}</h3>
                    <p>{data.ds_dbname}</p>
                    <Link to = {detail_url}> 자세히보기</Link>
                </li>
            )
        }
        return result
    }

    //alert 기본 함수
    sweetalert = (title, contents, icon, confirmButtonText) => {
        Swal.fire({
            title: title,
            text: contents,
            icon: icon,
            confirmButtonText: confirmButtonText
          })
    }

    render () {
        return (
            <section className="sub_wrap">
                <article className="s_cnt mp_pro_li ct1">
                    <div className="li_top">
                        <h2 className="s_tit1">Data Source 목록</h2>
                    </div>
                    <div className="li_top_sch af">
                        <Link to={'/data-site-map'} className="sch_bt2 sch_bt02">Data Source 맵</Link>
                    </div>
                    <div className="sw_list">
                        <ul>
                            {this.state.append_DatsSourceList}
                        </ul>
                    </div>
                    
                </article>
            </section>
        );
    }
}

export default DataSourceList;