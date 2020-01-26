
import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import $ from 'jquery';
import axios from "axios";
import cookie from 'react-cookies';
import Swal from 'sweetalert2'

class ResearchProjects extends Component {
    constructor (props) {
        super(props);
        
        this.state = {
            rsc_field_menu_isDrop: true,    // 연구분야 메뉴 클릭 확인 변수
            rsc_state_menu_isDrop: true,    // 연구상태 메뉴 클릭 확인 변수

            responseSubCode: '',    //subcode response 변수
            append_ResrchFld: '',   //연구분야 append 변수
            append_ResrchStat: '',  //연구상태 append 변수

            responseProjectList: '',//project 리스트 response 변수
            append_PjtList: '',     //project 리스트 append 변수

            temp_name: '', //연구분야, 연구상태 임시변수
            my_project_Flag: false,

            //검색용 변수
            ResrchFld_check: '',   //선택한 연구분야 변수
            ResrchState_check: '', //선택한 연구상태 변수
            Project_name: '', //선택한 연구상태 변수

            //정렬용 변수
            sort_column:'update_date DESC',//정렬 컬럼 변수
            before_sort: '',// 직전 정렬된 컬럼 변수

            //페이징 변수
            total_size: 0, //전체 데이터
            
            startRow: 0, //전체 정렬된 데이터중 추출할 시작 row
            endRow: 10, //한 페이지에 표시할 Row수
            
            startPage: 1, //페이징 시작
            endPage: 0, //페이징 마지막
            nowPage: 1, //현재 페이지
            page_size: 5, //페이지수 << 1 2 3 4 5 >>
            append_paging:'', // 페이징폼
            lastpage_Flag: false, // 마지막 페이지 여부
            small_flag: false, //페이지 사이즈보다 데이터 크기가 더 작은경우

            blockdetail: '', // 프로젝트 상세로 진입 가능 여부(승인요청, 책임연구자, 공동연구자 자격이 아닌 경우)

            //세션 처리
            usernm:'', //사용자 이름
            userid:'', //사용자 아이디
        }
    }

    componentDidMount() {
        // 세션 처리
        this.callSessionInfoApi()
        //연구 분야 리스트 호출
        this.callSubCodeApi('RF')
        //연구 상태 리스트 호출
        this.callSubCodeApi('RS')
        // Research Project 리스트 호출
        this.callResrchpjtListApi()
    }
    
    // 쿠키값 userid, username 호출
    callSessionInfoApi = (type) => {
        axios.post('/api/LoginForm?type=SessionConfirm', {
            token1 : cookie.load('userid') 
            , token2 : cookie.load('username') 
        })
        .then( response => {
            this.state.usernm = response.data.token2
            this.state.userid = response.data.token1
        })
        .catch( error => {this.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기');return false;} );
    }

    // Research Project 리스트 호출
    callResrchpjtListApi = async (useremail) => {
        this.state.blockdetail = ''
        try {
            //전체 Row Count
            axios.post('/api/Resrchpjt?type=count', {
                is_Owner_email : useremail,
                is_Owner_email2 : this.state.userid,
                is_ResrchFld : this.state.ResrchFld_check,
                is_ResrchState : this.state.ResrchState_check,
                is_ProjectName : this.state.Project_name
            })
            .then( response => {
                this.state.total_size = Math.ceil(response.data.json[0].total_count / this.state.endRow)
                this.state.page_size = 5
                if(this.state.total_size < this.state.page_size){
                    this.state.page_size = this.state.total_size
                    this.state.small_flag = true
                }else{
                    this.state.small_flag = false
                }
                
                //Project List 호출
                axios.post('/api/Resrchpjt?type=list', {
                    is_Owner_email : useremail,
                    is_Owner_email2 : this.state.userid,
                    startRow : this.state.startRow,
                    endRow : this.state.endRow,
                    is_ResrchFld : this.state.ResrchFld_check,
                    is_ResrchState : this.state.ResrchState_check,
                    is_ProjectName : this.state.Project_name,
                    is_SortColumn : this.state.sort_column
                })
                .then( response => {
                    try {
                        this.setState({ responseProjectList: response });
                        this.setState({ append_PjtList: this.ResrchpjtListAppend() });
                        this.setState({ append_paging: this.PagingAppend() });
                    } catch (error) {
                        this.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기')
                    }
                })
                .catch( response => {return false;} );
            })
            .catch( response => {return false;} );


        } catch (error) {
            this.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기')
        }
    }

    //  이전, 다음 페이지일때 페이지 세팅
    onSetting = (on_flag) => {
        this.state.startRow =  this.state.endRow * (on_flag-1)
        this.state.nowPage = on_flag
        
        this.callResrchpjtListApi()
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
        if(this.state.my_project_Flag == true){
            this.callResrchpjtListApi(this.state.userid)
        }else{
            this.callResrchpjtListApi()
        }
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

    // 마이프로젝트 리스트 append
    ResrchpjtListAppend = () => {
        let result = []
        var ResearchPjtlist = this.state.responseProjectList.data

        for(let i=0; i<ResearchPjtlist.json.length; i++){

            var date = ResearchPjtlist.json[i].pjt_start_date
            var year = date.substr(0,4)
            var month = date.substr(4,2)
            var day = date.substr(6,2)
            var pjt_startdate = year +'/'+month+'/'+day

            date = ResearchPjtlist.json[i].pjt_end_date
            year = date.substr(0,4)
            month = date.substr(4,2)
            day = date.substr(6,2)
            var pjt_enddate = year +'/'+month+'/'+day

            var project_code = ResearchPjtlist.json[i].pjt_code

            var detail_url = ''
            if(ResearchPjtlist.json[i].pjt_owner_email == this.state.userid){
                detail_url = '/my-pjw/'+project_code + '/modify'
            }else{
                detail_url = '/my-pjd/'+project_code
            }

            if(ResearchPjtlist.json[i].pjt_type == 'public'){
                var type = 'normal_type'
            }else{
                var type = 'hidden_type'
            }

            var role = ''
            var user = this.state.userid
            var style = {display:''}
            
            //내 아이디가 공동연구자 승인대기중 인 경우
            if(ResearchPjtlist.json[i].participtlist.indexOf(user+'/W') > -1){
                role = '승인요청'
            }else if(ResearchPjtlist.json[i].participtlist.indexOf(user+'/A') > -1){
                role = '공동'
                style = {display:'none'};
            }else if(ResearchPjtlist.json[i].pjt_owner_email.indexOf(user) > -1){
                role = '책임'
                style = {display:'none'};
            }else{
                role = ''
                detail_url = '/'
                this.state.blockdetail += (i+',')
                style = {display:'none'};
            }
            if(ResearchPjtlist.json[i].pjt_status =='등록'){
                style = {display:''};
            }
            
            result.push(
            
            <tr className={type}>
                <td width='45%'>
                    {/* my projects 세부 contents backend data필요 */}
                    <Link to={detail_url} id={i} onClick={(e) => this.goDetail(i, e)}>
                        {/* <!-- 신규글은 span 생성 --> */}
                        <h4>{ResearchPjtlist.json[i].pjt_name}<span className="new_li" style={style}>NEW</span></h4>
                        <p>{ResearchPjtlist.json[i].pjt_contents}</p>
                    </Link>
                </td>
                <td width='10%'>{ResearchPjtlist.json[i].pjt_field}</td>
                <td width='10%'>{ResearchPjtlist.json[i].pjt_owner}</td>
                <td width='10%'>{role}</td>
                <td width='15%'>{pjt_startdate} ~ <br/>{pjt_enddate}　</td>
                <td width='10%'>{ResearchPjtlist.json[i].pjt_status}</td>
            </tr>

            )
        }
        return result
    }

    //미참여 프로그램 상세페이지 진입 제한
    goDetail = (i, e) =>{
        if(this.state.blockdetail.indexOf(i) > -1){
            this.sweetalert('미참여한 프로젝트를 조회할 수 없습니다.', '', 'info', '닫기')
        }
    }

    // SubCode 호출
    callSubCodeApi = async (mstcode) => {
        try {
            const response = await fetch('/api/getSubCode', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ is_Subcode : mstcode}),
            });
            
            const body = await response.json();
            this.setState({ responseSubCode: body });
            if(mstcode === 'RF'){
                this.setState({ append_ResrchFld: this.ResrchFldAppend() });
            }else if(mstcode ==='RS'){
                this.setState({ append_ResrchStat: this.ResrchStatAppend() });
            }
        } catch (error) {
            this.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기')
        }
    };

    // 연구분야 리스트
    ResrchFldAppend = () => {
        let result = []
        for(let i=0; i<this.state.responseSubCode.json.length; i++){
            const idx = (i+1)+"";
            this.state.temp_name = 'resrch_field'
            this.state.temp_name = this.state.temp_name + idx;
            var tmp_id = 'rsc_field_'+idx
            result.push(
            <li>
                <label className="rsc_field_a" htmlFor={tmp_id} onClick={this.ReseachFieldCheckBoxClicked}>{this.state.responseSubCode.json[i].code_nm}</label>
                <span>
                    <input type="checkbox" name={this.state.temp_name} id={tmp_id} onClick={this.InputFieldCheckBoxClicked} value={this.state.responseSubCode.json[i].code_cd} />
                </span>
            </li>
            )
        }
        return result
    }

    // 연구상태 리스트
    ResrchStatAppend = () => {
        try {
            let result = []
            for(let i=0; i<this.state.responseSubCode.json.length; i++){
                const idx = (i+1)+"";
                this.state.temp_name = 'resrch_status'
                this.state.temp_name = this.state.temp_name + idx;
                var tmp_id = 'rsc_state_'+idx
                result.push(
                <li>
                    <label className="rsc_state_a1" htmlFor={tmp_id} onClick={this.ReseachStateCheckBoxClicked}>{this.state.responseSubCode.json[i].code_nm}</label>
                    <span>
                        <input type="checkbox" name={this.state.temp_name} id={tmp_id} onClick={this.InputStateCheckBoxClicked} value={this.state.responseSubCode.json[i].code_cd}/>
                    </span>
                </li>
                )
            }
            return result
            
        } catch (error) {
            this.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기')
        }
    }

    //  연구분야 드롭다운 input 클릭시
    InputFieldCheckBoxClicked = (e) => {
        if(this.state.ResrchFld_check == e.target.value){
            this.state.ResrchFld_check = ''
        }else{
            this.state.ResrchFld_check = e.target.value
        }
        this.ResearchFieldMenuClicked(e)
    }

    // 연구분야 메뉴 클릭 시
    ResearchFieldMenuClicked = (e) => {
        this.setState({
            rsc_field_menu_isDrop: !this.state.rsc_field_menu_isDrop
        });

        let current_target = e.target;
        $(current_target).parents('.sch_ty1').toggleClass('on');

        if(this.state.rsc_field_menu_isDrop === true)
        {
            $(current_target).parents('.sch_ty1').find('.schb_ty1').slideDown();
        }
        else
        {
            $(current_target).parents('.sch_ty1').find('.schb_ty1').slideUp();
        }
    }

    //  연구분야 드롭다운 세부 메뉴 클릭시
    ReseachFieldCheckBoxClicked = (e) => {
        let current_target = e.target;
        $('.rsc_field_a').not(current_target).removeClass('on');
        if($(current_target).hasClass('on')){
            $(current_target).removeClass('on');
        }else{
            $(current_target).addClass('on');
        }
    }

    //  연구상태 드롭다운 input 클릭시
    InputStateCheckBoxClicked = (e) => {
        if(this.state.ResrchState_check == e.target.value){
            this.state.ResrchState_check = ''
        }else{
            this.state.ResrchState_check = e.target.value
        }
        this.ResearchStateMenuClicked(e)
    }

    // 연구상태 메뉴 클릭 시
    ResearchStateMenuClicked  = (e) => {
        this.setState({
            rsc_state_menu_isDrop: !this.state.rsc_state_menu_isDrop
        });

        let current_target = e.target;
        $(current_target).parents('.sch_ty1').toggleClass('on');

        if(this.state.rsc_state_menu_isDrop === true)
        {
            $(current_target).parents('.sch_ty1').find('.schb_ty1').slideDown();
        }
        else
        {
            $(current_target).parents('.sch_ty1').find('.schb_ty1').slideUp();
        }
    }

    //  연구상태 드롭다운 세부 메뉴 클릭시
    ReseachStateCheckBoxClicked = (e) => {
        let current_target = e.target;
        $('.rsc_state_a1').not(current_target).removeClass('on');
        if($(current_target).hasClass('on')){
            $(current_target).removeClass('on');
        }else{
            $(current_target).addClass('on');
        }
    }

    //나의 프로젝트 버튼 클릭시
    myProjectClick = (e) => {
        if(this.state.my_project_Flag == false){
            this.state.append_PjtList = ''
            this.state.startRow = 0
            this.state.startPage = 1
            this.state.lastpage_Flag = false
            this.state.append_paging = ''
            this.callResrchpjtListApi(this.state.userid)
            this.state.my_project_Flag = true
        }else{
            this.state.page_size = 5
            this.state.small_flag = false
            this.callResrchpjtListApi()
            this.state.my_project_Flag = false
        }
    }

    //검색 결과 호출
    searchApiCall = (e) => {
        this.state.Project_name =$("input[name='is_ProjectName']").val()
        this.state.append_PjtList = ''
        this.state.startRow = 0
        this.state.startPage = 1
        this.state.lastpage_Flag = false
        this.state.append_paging = ''
        // Research Project 리스트 호출
        if(this.state.my_project_Flag){
            this.callResrchpjtListApi(this.state.userid)
        }else{
            this.callResrchpjtListApi()
        }
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

        this.state.append_PjtList = ''
        this.state.startRow = 0
        this.state.startPage = 1
        this.state.lastpage_Flag = false
        this.state.append_paging = ''
        // Research Project 리스트 호출
        if(this.state.my_project_Flag){
            this.callResrchpjtListApi(this.state.userid)
        }else{
            this.callResrchpjtListApi()
        }
        this.state.before_sort = current_target;
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
                        <h2 className="s_tit1">Research Project 목록</h2>
                        <div className="li_top_sch af">
                            <div className="mybt1">
                                <input type="checkbox" name="" id="my_p" onClick={(e) => this.myProjectClick(e)}/>
                                <label htmlFor="my_p"></label>
                                <p>나의 프로젝트</p>
                            </div>	
                            <div className="sch_ty1">
                                <h3 onClick={this.ResearchFieldMenuClicked}>연구분야</h3>
                                <ul className="schb_ty1 " >
                                    {this.state.append_ResrchFld}
                                </ul>
                            </div>

                            <div className="sch_ty1">
                                <h3 onClick={this.ResearchStateMenuClicked}>연구상태</h3>
                                <ul className="schb_ty1">
                                    {this.state.append_ResrchStat}
                                </ul>
                            </div>
                            <input className="input_ty1" type="text" name="is_ProjectName" placeholder="프로젝트 명을 입력해주세요." />
                            <a href="javascript::" className="sch_bt" onClick={this.searchApiCall}></a>
                            
                            <Link to={'/my-pjw/register/register'} className="sch_bt2">새 프로젝트 신청</Link>
                        </div>
                    </div>
 
                    <div className="list_cont">
                        <table className="table_ty1"> 
                            <tbody>
                                <tr>
                                    {/* <!-- 해당 글을 클릭시 클래스 on 생성 on 생성시 화살표 변경이 됨-->  */}
                                    <th className="sort" width='45%'><a href="javascript::" onClick={(e) => this.sortApiCall('pjt_name', e)}>프로젝트 명</a></th>
                                    <th className="sort" width='10%'><a href="javascript::" onClick={(e) => this.sortApiCall('pjt_field', e)}>연구 분야</a></th>
                                    <th className="sort" width='10%'><a href="javascript::" onClick={(e) => this.sortApiCall('pjt_owner', e)}>책임 연구자</a></th>
                                    <th width='10%'>내 역할</th>
                                    <th className="sort" width='15%'><a href="javascript::" onClick={(e) => this.sortApiCall('pjt_end_date', e)}>연구기간</a></th>
                                    <th className="sort" width='10%'><a href="javascript::" onClick={(e) => this.sortApiCall('pjt_status', e)}>상태</a></th>
                                </tr>
                            </tbody>
                        </table>

                        <table className="table_ty2">
                            <tbody>
                                {this.state.append_PjtList}
                            </tbody>
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

export default ResearchProjects;