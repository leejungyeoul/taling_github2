import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import axios from "axios";
import Swal from 'sweetalert2'

class SoftwareView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            responseSwtoolInfo: '',//swtool 정보 response 변수
            append_SwtoolInfo: '', //swtool 정보 append 변수

            responseSwFuncList: '',//swtool 기능 정보 response 변수
            append_SwFuncList: '', //swtool 기능 정보 append 변수

            swtcode: props.match.params.swtcode, //swtool 정보 swtool 코드
            swt_toolname: '', //swtool 정보 swt_toolname
        }
    }
    componentDidMount () {
        // SW Tool 정보 호출
        this.callSwToolInfoApi()
        // SW Tool 제공 기능 리스트 호출
        this.callSwFuncListApi()
    }

    // SW Tool 정보 호출
    callSwToolInfoApi = async () => {
        //SW Tool List 호출
        const response2 = await axios.get('/api/cmpathinfo');
        var node_url = response2.data.node_url;

        axios.post('/api/Swtool?type=info', {
            is_Swtcode: this.state.swtcode,
        })
        .then( response => {
            try {
                this.setState({ responseSwtoolInfo: response });
                this.setState({ append_SwtoolInfo: this.SwToolInfoAppend(node_url) });
            } catch (error) {
                this.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기')
            }
        })
        .catch( error => {this.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기');return false;} );
    }

    // SW Tool 정보 append
    SwToolInfoAppend = (node_url) => {
        let result = []
        var SwToolInfo = this.state.responseSwtoolInfo.data
        
            var data = SwToolInfo.json[0]
            this.state.swt_toolname = data.swt_toolname
            var file_name = data.swt_manual_path
            var path = node_url + '/swmanual/'+file_name;
            
            var imgpath = '/image/'+data.swt_big_imgpath

            result.push(
                <tbody>
                    <tr>
                        <th rowSpan="3" className="bn"><img src={imgpath} alt="" /></th>
                        <th>설명</th>
                        <td>{data.swt_comments}</td>
                    </tr>
                    <tr>
                        <th>데모사이트</th>
                        <td>{data.swt_demo_site}</td>
                    </tr>
                    <tr className="last_tr">
                        <th>사용메뉴얼</th>
                        <td>
                        {/* <a href={path} className="bt_c1 mb0">메뉴얼 보기</a> */}
                        <a href={path} download={file_name} className="bt_c1 bt_c2 mb0">다운로드</a>
                        </td>
                    </tr>
                </tbody>
            )
        return result
    }

     // SW Tool 제공 기능 리스트 호출
     callSwFuncListApi = async () => {
        //SW Tool List 호출
        axios.post('/api/Swtool?type=funclist', {
            is_Swtcode: this.state.swtcode,
        })
        .then( response => {
            try {
                this.setState({ responseSwFuncList: response });
                this.setState({ append_SwFuncList: this.SwToolListAppend() });
            } catch (error) {
                this.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기')
            }
        })
        .catch( response => {return false;} );
    }

    // SW Tool 제공 기능 리스트 append
    SwToolListAppend = () => {
        let result = []
        var SwToolList = this.state.responseSwFuncList.data
        for(let i=0; i<SwToolList.json.length; i++){
            var data = SwToolList.json[i]
            var idx = i+1
            if(idx < 10){
                idx = '0'+idx
            }
            result.push(
                <tr>
                    <th>{idx}</th>
                    <td>{data.swt_function}</td>
                </tr>
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
                        <h2 className="s_tit1"> Software Tools 상세보기</h2>
                    </div>
                    <div className="sw_view">
                        <h4 className="title_ty1"> {this.state.swt_toolname}이란?</h4>
                        <table className="tb_view">
                            {this.state.append_SwtoolInfo}
                        </table>

                        {/* <!-- 처음 5개만 노출.  5개 이상일 경우 좌측에 more버튼 생성. 클릭시 추가적으로 생성 --> */}
                        <h4 className="title_ty1">제공 기능
                            <a href="" className="f_more"></a>
                        </h4>
                        <div className="view_tbx">
                            <table className="table_ty3 table_ty6 table_ty06">
                                <tbody>
                                    {this.state.append_SwFuncList}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="btn_confirm mt20">
                        <Link to={'/sw-list'} className="bt_ty bt_ty2 submit_ty1">목록</Link>
                    </div>
                </article>
            </section>
        );
    }
}

export default SoftwareView;