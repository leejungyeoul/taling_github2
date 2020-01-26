import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import axios from "axios";
import Swal from 'sweetalert2'
import cookie from 'react-cookies';

class SoftwareList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            responseSwtoolList: '',//swtool 리스트 response 변수
            append_SwtoolList: '', //swtool 리스트 append 변수

            //페이징 변수
            total_size: 0, //전체 데이터

            startRow: 0, //전체 정렬된 데이터중 추출할 시작 row
            endRow: 5, //한 페이지에 표시할 Row수
            
            startPage: 1, //페이징 시작
            endPage: 0, //페이징 마지막
            nowPage: 1, //현재 페이지
            page_size: 2, //페이지수 << 1 2 3 4 5 >>
            append_paging:'', // 페이징폼
            lastpage_Flag: false, // 마지막 페이지 여부
            small_flag: false, //페이지 사이즈보다 데이터 크기가 더 작은경우
            admin_usernm:'', //관리자 이름
            admin_userid:'', //관리자 아이디
        }
    }

    componentDidMount() {
        // 세션 처리
        this.callSessionInfoApi()
        // SW Tool 리스트 호출
        this.callSwToolListApi()
    }

    // 쿠키값 userid, username 호출
    callSessionInfoApi = (type) => {
        axios.post('/api/LoginForm?type=SessionConfirm', {
            token1 : cookie.load('userid') 
            , token2 : cookie.load('username') 
        })
        .then( response => {
            this.state.admin_usernm = response.data.token2
            this.state.admin_userid = response.data.token1
        })
        .catch( error => {this.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기');return false;} );
    }

    //로그 저장
    saveLogMessage = (log_cd, log_contents) => {
        axios.post('/api/system?type=log', {
            is_Log_cd : log_cd,
            is_Log_contents : log_contents,
            is_Reg_usernm : this.state.admin_usernm,
            is_Reg_user : this.state.admin_userid,
        })
        .then( response => {
        })
        .catch( response => {this.sweetalert('작업중 오류가 발생하였습니다.', response, 'error', '닫기')} ); 
    }

    // SW Tool 리스트 호출
    callSwToolListApi = async () => {
        //전체 Row Count
        axios.post('/api/Swtool?type=listCount', {
        })
        .then( response => {
            this.state.total_size = Math.ceil(response.data.json[0].total_count / this.state.endRow)
            this.state.page_size = 2
            if(this.state.total_size < this.state.page_size){
                this.state.page_size = this.state.total_size
                this.state.small_flag = true
            }else{
                this.state.small_flag = false
            }

            //SW Tool List 호출
            axios.post('/api/Swtool?type=list', {
                startRow : this.state.startRow,
                endRow : this.state.endRow,
            })
            .then( response => {
                try {
                    this.setState({ responseSwtoolList: response });
                    this.setState({ append_SwtoolList: this.SwToolListAppend() });
                    this.setState({ append_paging: this.PagingAppend() });
                } catch (error) {
                    this.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기')
                }
            })
            .catch( error => {this.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기');return false;} );
        })
        .catch( error => {this.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기');return false;} );
    }

    // SW Tool 리스트 append
    SwToolListAppend = () => {
        let result = []
        var SwToolList = this.state.responseSwtoolList.data
        
        for(let i=0; i<SwToolList.json.length; i++){
            var data = SwToolList.json[i]

            var date = data.reg_date
            var year = date.substr(0,4)
            var month = date.substr(4,2)
            var day = date.substr(6,2)
            var reg_date = year +'.'+month+'.'+day

            result.push(
                <tr class="hidden_type">
                <td>{data.swt_toolname}</td>
                <td>{data.swt_function}</td>
                <td>{reg_date}</td>
                <td>
                    <Link to={'/AdminSoftwareView/'+data.swt_code} className="bt_c1 bt_c2 w50_b">수정</Link>
                    <a href="#n" class="bt_c1 w50_b" id={data.swt_code} toolname={data.swt_toolname} onClick={(e) => this.deleteSwtool(e)}>삭제</a>
                </td>
                </tr>
            )
        }
        return result
    }

    // 리스트에서 툴삭제
    deleteSwtool = (e) => {
        //삭제 권한 부여
        var event_target = e.target
        var tmp_this = this
        this.sweetalertDelete('정말 삭제하시겠습니까?', function() {
            axios.post('/api/Swtool?type=delbefore', {
                is_SwtCd : event_target.getAttribute('id')
            })
            .then( response => {
                var toolname = event_target.getAttribute('toolname')
                tmp_this.saveLogMessage('LG9','Software Tools을 삭제했습니다. Tool 명 : '+toolname+' 관리자 계정 : '+tmp_this.state.admin_userid)
            })

            tmp_this.callSwToolListApi()
        })
    }

    // 페이지 리스트 append
    PagingAppend = () => {
        let result = []
        
        var tmp = []
        if(!this.state.lastpage_Flag){
            this.state.endPage = this.state.startPage + this.state.page_size -1
        }
        if(this.state.startPage != 1){
            tmp.push(<li className="start_page"><a href="javascript::" onClick={(e) => this.NextPage('before',e)}></a></li>)
        }
        for(let i= this.state.startPage; i<=this.state.endPage; i++){
                if(this.state.nowPage == i){
                    tmp.push(<li className="on"><a href="javascript::" id={i} onClick={(e) => this.setPage(e)}>{i}</a></li>)
                }else{
                    tmp.push(<li><a href="javascript::" id={i} onClick={(e) => this.setPage(e)}>{i}</a></li>)
                }
        }
        if(this.state.endPage <= (Math.floor(this.state.total_size / this.state.page_size)*this.state.page_size) && !this.state.small_flag && this.state.endPage != this.state.total_size){
            tmp.push(<li className="last_page"><a href="javascript::" onClick={(e) => this.NextPage('next',e)}></a></li>)
        }

        result.push(
            <ul>
                {tmp}
            </ul>
        )
        return result
    }

    //선텍한 페이지로 이동
    setPage = (e) => {
        var select_page = e.target.id
        this.state.startRow =  this.state.endRow * (select_page-1)
        this.state.nowPage = select_page
        // 사용자 리스트 호출
        this.callSwToolListApi(this.state.Username, this.state.checkFlag)
    }

    //이전, 다음 페이지 리스트로 이동
    NextPage = (type, e) => {
        var on_flag = ''
        if(type == 'before' && this.state.startPage > 1){
            on_flag = this.state.startPage-1
            this.state.startPage -= this.state.page_size
            this.state.endPage -= this.state.page_size
            this.state.lastpage_Flag = false
        }else if(type == 'next' && this.state.endPage < this.state.total_size){
            on_flag = this.state.endPage+1
            this.state.startPage += this.state.page_size
            if((this.state.startPage+this.state.page_size-1) <=  this.state.total_size){
                this.state.endPage = this.state.startPage+this.state.page_size-1
            }else{
                this.state.endPage = this.state.total_size
            }
            this.state.lastpage_Flag = true
        }
        this.onSetting(on_flag)
    }

    //  이전, 다음 페이지일때 페이지 세팅
    onSetting = (on_flag) => {
        this.state.startRow =  this.state.endRow * (on_flag-1)
        this.state.nowPage = on_flag
        // 사용자 리스트 호출
        this.callSwToolListApi(this.state.Username, this.state.checkFlag)
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

    //alert 삭제 함수
    sweetalertDelete = (title, callbackFunc) => {
        Swal.fire({
            title: title,
            text: "",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes'
          }).then((result) => {
            if (result.value) {
              Swal.fire(
                'Deleted!',
                '삭제되었습니다.',
                'success'
              )
            }else{
                return false;
            }
            callbackFunc()
          })
    }

    render () {
        return (
            <section class="sub_wrap" >
                <article class="s_cnt mp_pro_li ct1 mp_pro_li_admin">
                    <div class="li_top">
                        <h2 class="s_tit1">Software Tools 목록</h2>
                        <div class="li_top_sch af">
                        <Link to={'/AdminSoftwareView/register'} className="sch_bt2 wi_au">Tool 등록</Link>
                        </div>
                    </div>

                    <div class="list_cont list_cont_admin">
                        <table class="table_ty1 ad_tlist">
                            <tr>
                                <th>툴 이름</th>
                                <th>기능</th>
                                <th>등록일</th>
                                <th>기능</th>
                            </tr>
                        </table>	
                        <table class="table_ty2 ad_tlist">
                            {this.state.append_SwtoolList}
                        </table>

                        <div className="page_ty1">
                            {this.state.append_paging}
                        </div>
                    </div>
                </article>
            </section>
        );
    }
}

export default SoftwareList;