import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import axios from "axios";
import Swal from 'sweetalert2'

class SoftwareList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            responseSwtoolList: '',//swtool 리스트 response 변수
            append_SwtoolList: '', //swtool 리스트 append 변수
        }
    }

    componentDidMount() {
        // SW Tool 리스트 호출
        this.callSwToolListApi()
    }

    // SW Tool 리스트 호출
    callSwToolListApi = async () => {
        //SW Tool List 호출
        axios.post('/api/Swtool?type=list', {
        })
        .then( response => {
            try {
                this.setState({ responseSwtoolList: response });
                this.setState({ append_SwtoolList: this.SwToolListAppend() });
            } catch (error) {
                this.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기')
            }
        })
        .catch( error => {this.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기');return false;} );
    }

    // SW Tool 리스트 append
    SwToolListAppend = () => {
        let result = []
        var SwToolList = this.state.responseSwtoolList.data
        
        for(let i=0; i<SwToolList.json.length; i++){
            var data = SwToolList.json[i]
            var detail_url = '/sw-view/'+data.swt_code

            var imgpath = '/image/'+data.swt_big_imgpath

            result.push(
                <li className="swtoolImg">
                    <figure><img src={imgpath} alt="" /></figure>
                    <h3>{data.swt_toolname}</h3>
                    <p>{data.swt_function} </p>
                    <Link to={detail_url}>자세히보기</Link>
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

    // ### render start ###
    render () {
        return (
            <section className="sub_wrap" >
                <article className="s_cnt mp_pro_li ct1">
                    <div className="li_top">
                        <h2 className="s_tit1">Software Tool 목록</h2>
                    </div>
                    <div className="sw_list">
                        <ul>
                            {this.state.append_SwtoolList}
                        </ul>
                    </div>
                    
                </article>
            </section>
        );
    }
}

export default SoftwareList;
