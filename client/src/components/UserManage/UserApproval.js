import React, { Component } from 'react';
import axios from "axios";
import $ from 'jquery';
import Swal from 'sweetalert2'
import cookie from 'react-cookies';

class UserApproval extends Component {
    constructor(props) {
        super(props);

        this.state = {
            responseUserList: '',//User 리스트 response 변수
            append_UserList: '', //User 리스트 append 변수

            checkFlag:'', // 가입신청 check여부
            clickEmail:'', // 승인버튼 클릭한 row의 이메일
            clickusername:'',// 승인버튼 클릭한 row의 이름
            clickuserorg:'',// 승인버튼 클릭한 row의 소속
            clickusermajor:'',// 승인버튼 클릭한 row의 전공
            clickstatus:'',// 승인버튼 클릭한 row의 상태

            //검색용 변수
            Username:'', // 검색 이름
            
            //정렬용 변수
            sort_column:'FIELD(userflag, \'Y\', \'N\') DESC, reg_date DESC' , //정렬 컬럼 변수
            before_sort: '', // 이전 정렬 타겟 변수
            
            //페이징 변수
            total_size: 0, //전체 데이터
            
            startRow: 0, //전체 정렬된 데이터중 추출할 시작 row
            endRow: 5, //한 페이지에 표시할 Row수
            
            startPage: 1, //페이징 시작
            endPage: 0, //페이징 마지막
            nowPage: 1, //현재 페이지
            page_size: 2, //페이지수 << 1 2 3 4 5 >>
            append_paging:'', // 페이징 폼
            lastpage_Flag: false, // 마지막 페이지 여부
            small_flag: false, //페이지 사이즈보다 데이터 크기가 더 작은경우

            responseProjectList: '',//project 리스트 response 변수
            append_PjtList: '',     //project 리스트 append 변수
            admin_usernm:'', //관리자 이름
            admin_userid:'', //관리자 아이디
        }
    }

    componentDidMount() {
        // 세션 처리
        this.callSessionInfoApi()
        // 사용자 리스트 호출
        this.callUserListApi('', '')
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

    //검색 결과 호출
    searchApiCall = (e) => {
        this.state.Username = $("input[name='is_UserName']").val()
        this.state.startRow = 0
        this.state.startPage = 1
        this.state.lastpage_Flag = false
        this.state.append_paging = ''
        // 사용자 리스트 호출
        this.callUserListApi(this.state.Username, this.state.checkFlag)
    }

    // 사용자 리스트 호출
    callUserListApi = async (username, apply_flag ) => {
            //전체 Row Count
            axios.post('/api/LoginForm?type=ApprovalCount', {
                is_Username : username,
                is_Applyflag : apply_flag,
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
                // 사용자 리스트 호출
                axios.post('/api/LoginForm?type=Approval', {
                    is_Username : username,
                    is_Applyflag : apply_flag,
                    is_SortColumn : this.state.sort_column,
                    startRow : this.state.startRow,
                    endRow : this.state.endRow,
                })
                .then( response => {
                    try {
                        this.setState({ responseUserList: response });
                        this.setState({ append_UserList: this.UserListAppend() });
                        this.setState({ append_paging: this.PagingAppend() });
                    } catch (error) {
                        this.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기')
                    }
                })
                .catch( error => {this.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기');return false;} );
            })
            .catch( error => {this.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기');return false;} );
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
        this.callUserListApi(this.state.Username, this.state.checkFlag)
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
        this.callUserListApi(this.state.Username, this.state.checkFlag)
    }
        
    // 사용자 리스트 append
    UserListAppend = () => {
        let result = []
        var UserList = this.state.responseUserList.data

        for(let i=0; i<UserList.json.length; i++){
            var status = '가입신청'
            if(UserList.json[i].userflag == 'Y'){
                status = '일반'
            }else if(UserList.json[i].userflag == 'M'){
                status = '관리자'
            }

            result.push(
                <tr className="hidden_type">
                    <td>{UserList.json[i].username}</td>
                    <td>{UserList.json[i].userorg}</td>
                    <td>{UserList.json[i].usermajor}</td>
                    <td>{UserList.json[i].useremail}</td>
                    <td>{UserList.json[i].userphone}</td>
                    <td>{status}</td>
                    <td><a href="#n" className="pr_list_bt"
                        status={status}
                        useremail={UserList.json[i].useremail}
                        username={UserList.json[i].username}
                        userorg={UserList.json[i].userorg}
                        usermajor={UserList.json[i].usermajor} onClick={this.ShowProject}>{UserList.json[i].pjtcount}</a>
                    </td>
                    <td>
                        <a href="#n" className="bt_c1 w50_b" useremail={UserList.json[i].useremail} onClick={this.deleteApproval}>삭제</a>
                        <a href="#n" className="bt_c1 bt_c2 w50_b pr_compl"
                        status={status}
                        useremail={UserList.json[i].useremail}
                        username={UserList.json[i].username}
                        userorg={UserList.json[i].userorg}
                        usermajor={UserList.json[i].usermajor} onClick={this.Approval}>승인</a>
                    </td>
                </tr>
            )
        }
        return result
    }
    
    //가입신청 checkbox
    applyCheck = (e) => {
        var flag = $('#us_check').is(":checked")
        if(flag){
            this.state.checkFlag = 'N'
        }else{
            this.state.checkFlag = 'Y'
        }
    }

    //승인 레이어 팝업 노출
    Approval = (e) =>{
        this.state.clickEmail = e.target.getAttribute('useremail')
        this.state.clickusername = e.target.getAttribute('username')
        this.state.clickuserorg = e.target.getAttribute('userorg')
        this.state.clickusermajor = e.target.getAttribute('usermajor')
        this.state.clickstatus = e.target.getAttribute('status')
        if(this.state.clickstatus == '일반' || this.state.clickstatus == '가입신청'){
            $('#user_type').val('Y');
        }else if(this.state.clickstatus == '관리자'){
            $('#user_type').val('M');
        }
        
        $('.pop_project8').fadeIn();		
        $("html").css("overflow","hidden");
        $("body").css("overflow","hidden");
    }

    //승인 레이어 팝업 확인버튼
    Confirm = (type, e) => {
        $('.pop_project').fadeOut();
        $("html").css("overflow","visible");
        $("body").css("overflow","visible");
        var usertype = ''
        if(type == 'Y'){
            usertype = $('#user_type').val();
        }else if(type == 'N'){
            usertype = 'D'
        }

        axios.post('/api/LoginForm?type=UpateAppr', {
            is_Email : this.state.clickEmail,
            is_Applyflag : usertype,
        })
        .then( response => {
            // 사용자 리스트 호출
            this.callUserListApi(this.state.Username, this.state.checkFlag)
            if(type == 'Y'){
                this.sendEmail(this.state.clickEmail, 'rtrod 사용자 승인 완료', '관리자님이 사용자 권한을 승인했습니다. 사이트 정상 이용 가능합니다.')
                this.saveLogMessage('LG8','사용자 계정을 승인했습니다. 승인계정 : '+this.state.clickEmail+' 관리자 계정 : '+this.state.admin_userid)
            }else if(type == 'N'){
                this.saveLogMessage('LG8','사용자 계정을 삭제했습니다. 삭제계정 : '+this.state.clickEmail+' 관리자 계정 : '+this.state.admin_userid)
            }
        })
        .catch( error => {this.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기')} );
    }

    //프로젝트 연구기간 연장 메일 발송
    sendEmail = (email, subject, text, e) => {
        axios.post('/api/message?type=email&roll=basic', {
            is_Email : email,
            is_Subject : subject,
            is_Text: text
        })
        .then( response => {
        })
        .catch( error => {this.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기');return false;});
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

    //승인 요청 삭제
    deleteApproval = (e) => {
        var event_target = e.target
        var tmp_this = this
        this.sweetalertDelete('정말 삭제하시겠습니까?', function() {
            tmp_this.state.clickEmail = event_target.getAttribute('useremail')
            tmp_this.Confirm('N',e)
        })
    }

    //승인 팝업 취소버튼
    ClosePopup = (e) => {
        $('.pop_project').fadeOut();
        $("html").css("overflow","visible");
        $("body").css("overflow","visible");
    }

    //정렬 결과 호출
    sortApiCall = (sortcolm, e) => {
        let current_target = e.target;
        var sort_type = ''
        if(current_target != this.state.before_sort){
            $(this.state.before_sort).parents('.sort').removeClass('on');
        }
        $(current_target).parents('.sort').toggleClass('on');
        
        if($(current_target).parents('.sort').hasClass('on')){
            sort_type =  'desc'
        }
        this.state.sort_column = sortcolm+' '+sort_type

        this.state.startRow = 0
        this.state.startPage = 1
        this.state.lastpage_Flag = false
        this.state.append_paging = ''
        // 사용자 리스트 호출
        this.callUserListApi(this.state.Username, this.state.checkFlag)
        this.state.before_sort = current_target;
    }
    //계정별 프로젝트 리스트 팝업 노출
    ShowProject =(e) => {

        this.state.clickEmail = e.target.getAttribute('useremail')
        this.state.clickusername = e.target.getAttribute('username')
        this.state.clickuserorg = e.target.getAttribute('userorg')
        this.state.clickusermajor = e.target.getAttribute('usermajor')
        this.state.clickstatus = e.target.getAttribute('status')

        //Project List 호출
        axios.post('/api/Resrchpjt?type=list', {
            is_Owner_email : this.state.clickEmail,
            is_Owner_email2 : this.state.clickEmail,
            is_SortColumn : 'update_date DESC'
        })
        .then( response => {
            try {
                this.setState({ responseProjectList: response });
                this.setState({ append_PjtList: this.ResrchpjtListAppend() });
            } catch (error) {
                this.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기')
            }
        })
        .catch( response => {return false;} );

        $('.pop_project7').fadeIn();		
        $("html").css("overflow","hidden");
        $("body").css("overflow","hidden");
    }

    // 프로젝트 리스트 append
    ResrchpjtListAppend = () => {
        let result = []
        var ResearchPjtlist = this.state.responseProjectList.data

        for(let i=0; i<ResearchPjtlist.json.length; i++){

            var date = ResearchPjtlist.json[i].pjt_start_date
            var year = date.substr(0,4)
            var month = date.substr(4,2)
            var day = date.substr(6,2)
            var pjt_startdate = year +'.'+month+'.'+day

            date = ResearchPjtlist.json[i].pjt_end_date
            year = date.substr(0,4)
            month = date.substr(4,2)
            day = date.substr(6,2)
            var pjt_enddate = year +'.'+month+'.'+day

            result.push(
                <tr>
                    <td>{ResearchPjtlist.json[i].pjt_name}</td>
                    <td>{ResearchPjtlist.json[i].pjt_name}</td>
                    <td>
                        <p>{pjt_startdate}</p>
                        <p>{pjt_enddate}</p>
                    </td>
                    <td>{ResearchPjtlist.json[i].pjt_status}</td>
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
            <section className="sub_wrap" >
                <article className="s_cnt mp_pro_li ct1 mp_pro_li_admin">
                    <div className="li_top">
                        <h2 className="s_tit1">사용자 목록</h2>
                        <div className="us_top af" style={{width:"581px"}}>
                            <div className="user_sch user_sch1 user_sch0">
                                <label>성명</label>
                                <input type="text" name="is_UserName" placeholder="이름을 입력해주세요."/>
                                <a className="bt_c1 sch_bt3"href="#n" onClick={this.searchApiCall}>조회</a>
                            </div>
                            <div className="user_check">
                                <span>상태</span>
                                <input type="checkbox" name="is_Appflag" id="us_check" onClick={this.applyCheck}/>
                                <label for="us_check">가입신청</label>
                            </div>
                        </div>
                    </div>

                    <div className="list_cont list_cont_admin">
                        <table className="table_ty1">
                            <tr>
                                <th className="sort"><a href="javascript::" onClick={(e) => this.sortApiCall('username', e)}>성명</a></th>
                                <th className="sort"><a href="javascript::" onClick={(e) => this.sortApiCall('userorg', e)}>소속기관</a></th>
                                <th className="sort"><a href="javascript::" onClick={(e) => this.sortApiCall('usermajor', e)}>전공</a></th>
                                <th className="sort"><a href="javascript::" onClick={(e) => this.sortApiCall('useremail', e)}>이메일</a></th>
                                <th className="sort"><a href="javascript::" onClick={(e) => this.sortApiCall('userphone', e)}>핸드폰</a></th>
                                <th className="sort"><a href="javascript::" onClick={(e) => this.sortApiCall('userflag', e)}>상태</a></th>
                                <th className="sort"><a href="javascript::" onClick={(e) => this.sortApiCall('pjtcount', e)}>Project 수</a></th>
                                <th>기능</th>
                            </tr>
                        </table>	
                        <table className="table_ty2">
                            {this.state.append_UserList}
                        </table>

                        <div className="pop_project pop_project8">
                            <h2 className="p_title">사용자 승인</h2>
                            <form name="" id="" action="post">
                                <div className="pj_wrap">
                                    <h4 className="pj_tit">사용자 정보</h4>
                                    <ul className="pj_inpo">
                                        <li><span>성명 : </span>{this.state.clickusername}</li>
                                        <li><span>소속/전공 : </span> {this.state.clickuserorg}/{this.state.clickusermajor}</li>
                                        <li><span>권한 : </span>
                                            <select id="user_type" name="user_type" className="select_ty1 pop_select">
                                                <option value="Y">일반회원</option>
                                                <option value="M">관리자</option>
                                            </select>
                                        </li>
                                    </ul>	
                                </div>
                                <div className="p_btn_box">
                                    <a href="#n" className="p_btn p_btn1 cencel_bt"  onClick={(e) => this.ClosePopup(e)} style={{width: "50%"}}>취소</a>
                                    <a href="#n" className="p_btn p_btn2 p_btn2"  onClick={(e) => this.Confirm('Y', e)} style={{width: "50%"}}>확인</a>
                                </div>
                            </form>
                        </div>

                        <div class="pop_project pop_project7">
                            <h2 class="p_title">사용자 프로젝트 목록</h2>
                            <form name="" id="" action="post">
                                <div class="pj_wrap">
                                    <h4 class="pj_tit">사용자 정보</h4>
                                    <ul class="pj_inpo">
                                        <li><span>성명 : </span>{this.state.clickusername}</li>
                                        <li><span>소속/전공 : </span> {this.state.clickuserorg}/{this.state.clickusermajor}</li>
                                    </ul>	
                                    <div class="pj_t_wrap">
                                        <h4 class="pj_tit mb20" >프로젝트 목록</h4>
                                        <table class="table_ty8">
                                            <tr>
                                                <th width='35%'>프로젝트 명</th>
                                                <th width='35%'>연구책임자</th>
                                                <th width='15%'>연구기간</th>
                                                <th width='15%'>상태</th>
                                            </tr>
                                            {this.state.append_PjtList}
                                        </table>
                                    </div>
                                </div>
                                <div class="p_btn_box">
                                    <a href="#n" class="p_btn p_btn2 cencel_bt" onClick={(e) => this.ClosePopup(e)}  style={{width: "100%"}}>확인</a>
                                </div>
                            </form>
                        </div>

                        <div className="page_ty1">
                            {this.state.append_paging}
                        </div>
                    </div>
                </article>
            </section>
        );
    }
}

export default UserApproval;