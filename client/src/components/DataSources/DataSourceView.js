import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import axios from "axios";
import Swal from 'sweetalert2'

class DataSourceView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            responseDataSourceInfo: '',//datasource 정보 response 변수
            append_DataSourceInfo: '', //datasource 정보 append 변수

            dscode: props.match.params.dscode, //datasource 정보 swtool 코드
            ds_name: '', //datasource 정보 datasource name
        }
    }

    componentDidMount () {
        // datasource 정보 호출
        this.callDatasourceInfoApi()
    }

    // DataSource 정보 호출
    callDatasourceInfoApi = async () => {
        //DataSource List 호출
        axios.post('/api/DataSource?type=info', {
            is_Dscode: this.state.dscode,
        })
        .then( response => {
            try {
                this.setState({ responseDataSourceInfo: response });
                this.setState({ append_DataSourceInfo: this.DsSourceInfoAppend() });
            } catch (error) {
                this.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기')
            }
        })
        .catch( response => {return false;} );
    }

    // DataSource 정보 append
    DsSourceInfoAppend = () => {
        let result = []
        var DsSourceInfo = this.state.responseDataSourceInfo.data
        
            var data = DsSourceInfo.json[0]

            var date =data.ds_start_date
            var year = date.substr(0,4)
            var month = date.substr(4,2)
            var day = date.substr(6,2)
            var ds_startdate = year +'.'+month+'.'+day

            date = data.ds_end_date
            year = date.substr(0,4)
            month = date.substr(4,2)
            day = date.substr(6,2)
            var ds_enddate = year +'.'+month+'.'+day
            
            var ds_patnt_count = data.ds_patnt_count.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
            var imgpath = '/image/'+data.ds_big_imgpath

            result.push(
                <tbody>
                    <tr>
                        <th rowspan="8" className="bn"><img src={imgpath} alt="" /></th>
                        <th>구분</th>
                        <td>{data.ds_typenm}</td>
                    </tr>
                    <tr>
                        <th>설명</th>
                        <td>{data.ds_comments}</td>
                    </tr>
                    <tr className="">
                        <th>CDM 버전</th>
                        <td>{data.ds_cdm_version}</td>
                    </tr>
                    <tr className="">
                        <th>보유 기관</th>
                        <td>{data.ds_holdorg}</td>
                    </tr>
                    <tr className="">
                        <th>데이터 기간</th>
                        <td>{ds_startdate}-{ds_enddate}</td>
                    </tr>
                    <tr className="">
                        <th>환자 수</th>
                        <td>{ds_patnt_count} 명</td>
                    </tr>
                    <tr className="">
                        <th>Data type</th>
                        <td>{data.ds_data_type}</td>
                    </tr>
                    <tr className="last_tr">
                        <th>Data source 위치</th>
                        <td>{data.ds_db_location}</td>
                    </tr>
                </tbody>
            )
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
            <section className="sub_wrap" >
                <article className="s_cnt mp_pro_li ct1">
                    <div className="li_top">
                        <h2 className="s_tit1">Data Source 상세 보기</h2>
                    </div>
                    <div className="sw_view">
                        <h4 className="title_ty1"></h4>
                        <table className="tb_view tb_view2">
                            {this.state.append_DataSourceInfo}
                        </table>

                    </div>
                    <div className="btn_confirm mt20">
                        <Link to={'/data-src-list'} className="bt_ty bt_ty2 submit_ty1">목록</Link>
                    </div>
                </article>
            </section>
        );
    }
}

export default DataSourceView;