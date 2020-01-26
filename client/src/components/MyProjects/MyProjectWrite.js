import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import $ from 'jquery';
import axios from "axios";
import cookie from 'react-cookies';
import { RangeDatePicker } from '@y0c/react-datepicker';
import "dayjs/locale/ko";
import "../../css/red.scss";
import '../../css/project.css';

import Swal from 'sweetalert2'


class MyProjectWrite extends Component {
    constructor (props) {
        super(props);
        
        this.state = {
            rsc_field_menu_isDrop: true,    // 연구분야 메뉴 클릭 확인 변수
            responseSubCode: '',    //subcode response 변수
            append_ResrchFld: '',   //연구분야 append 변수
            ResrchFld_check: '',   //선택한 연구분야 변수
            pjct_code: '', // 저장될 프로젝트 코드
            notice_code: '', // 저장될 알림 코드
            pjt_status:'RS1', // 프로젝트 상태

            responseResearcherList: '',//공동연구자 리스트 response 변수
            append_ResearcherList: '', //공동연구자 리스트 append 변수

            one_paticipant_username: '', //공동연구자 1명 조회 후 신청시에 사용 연구자명
            one_paticipant_email: '', //공동연구자 1명 조회 후 신청시에 사용 이메일

            responseDataSrceList: '',//datasource 리스트 response 변수
            append_DataSrceList: '', //datasource 리스트 append 변수

            select_DataSrce_size: '',//선택한 datasource 리스트 size 변수
            append_selectDataSrceList: '',//선택한 datasource 리스트 변수

            responseSWtoolList: '',//SWtool 정보 response 변수
            append_SWtoolIList: '', //SWtool 정보 append 변수

            select_SWtool_size: '',//선택한 software 리스트 size 변수
            append_selectSWtoolList: '',//선택한 software 리스트 변수

            responseReplyList: '',//댓글 정보 response 변수
            append_ReplyList: '', //댓글 정보 append 변수

            DataSourceData:[], // datasource array
            DataSourceflagData:[], // datasource 승인여부
            SwtooltData:[],// sofrwaretool array
            SwtooltflagData:[], // sofrwaretool 승인여부
            ptcipantDataEmail:[], // 공동연구자 이메일
            ptcipantDataName:[], // 공동연구자명
            ptcipantDataFlag:[], // 공동연구자 승인여부
            uploadFileName:[], // 업로드 파일명
            uploadFileRegdate:[], // 파일 업로드 등록 날짜
            uploadFileReguser:[], // 파일 업로드 등록 사용자
            deleteMapperList:['deleteProjectInfo','deleteDataSource','deleteSWTool','deleteParticipant', 'deleteUploadFile'], // delete문 실행할 mapper 명

            //수정페이지로 사용
            flag: props.match.params.flag, //저장, 수정 페이지 구분
            before_pjtcode: props.match.params.pjtcode,//수정전 project 코드
            responseProjectInfo: '',//project 정보 response 변수
            pjt_field_cd:'', // 연구 분야 코드

            responseParticipantInfo: '',//공동연구자 정보 response 변수
            
            responseDataSrceInfo: '',//datasource 정보 response 변수
            analysis_DataSrceInfo: '', //프로젝트 분석하기 datasource 정보
            DataSourceModiList:'',//수정페이지에서 기존에 등록된 datasource 정보
            DataSourceModiAcceptList:'',//수정페이지에서 기존에 등록된 승인 datasource 정보
            DataSourceWaitAcceptList:'',//수정페이지에서 기존에 등록된 승인대기 datasource 정보
            responseSWtoolInfo: '',//SWtool 정보 response 변수
            analysis_SWtoolInfo: '', //프로젝트 분석하기 SWtool 정보
            SwToolModiList:'',//수정페이지에서 기존에 등록된 SWtool 정보
            SwToolModiAcceptList:'',//수정페이지에서 기존에 등록된 승인 SWtool 정보
            SwToolWaitAcceptList:'',//수정페이지에서 기존에 등록된 승인대기 SWtool 정보
            append_fileform:'', // 파일 입력 폼
            
            //파일 업로드
            file_result: [], // 파일 업로드 결과 변수
            selectedFile: null, //업로드 대상 파일

            file_idx: 0,
            responseUploadfileInfo: '',//Uploadfile 정보 response 변수
            append_UploadfileInfo: '', //Uploadfile 정보 append 변수

            //연구 기간 연장
            pjt_name:'', // 기간연장 팝업 변수 : 연구명
            pjt_period:'', // 기간연장 팝업 변수 : 연구기간
            //달력
            calender_click_show:false,
            calender_flag: '1',

            append_pctAddList: '', //공동연구자 추가 정보
            pctAddresult : [], //공동연구자 추가 리스트

            reg_date: '', //프로젝트 수정할때 최초 등록날짜 insert

            ResrchFldSelect: '연구분야', //연구분야 select 박스 선택값표시
            showCalendarDisable: '', //수정이면서 승인대기 상태가 아니면 달력 버튼 비활성화

            datasrceWflag:false,// datasouce 승인대기 유무
            swtoolWflag:false,// softwaretool 승인대기 유무

            //세션 처리
            usernm:'', //사용자 이름
            userid:'', //사용자 아이디

            //software tool url 연동위한 변수
            swt_code: '' // software tool 코드

        }
    }

    componentDidMount() {
        this.callSessionInfoApi()
        //수정페이지인 경우
        if(this.state.flag == 'modify'){
            // 세션 처리
            // 프로젝트 상세 연구정보 호출
            this.callResrchInfoApi(this.state.before_pjtcode)
            // 공동연구자 정보 호출
            this.callparticipantInfoApi(this.state.before_pjtcode)
            // datasource 정보 호출
            this.callDataSrceInfoApi(this.state.before_pjtcode)
            // SWtool 정보 호출
            this.callSWtoolInfoApi(this.state.before_pjtcode)
            // 연구파일 정보 호출
            this.callUploadFileInfoApi(this.state.before_pjtcode)
            // 댓글 정보 호출
            this.callReplyListApi(this.state.before_pjtcode)
            // 연장 연구기간 호출
            this.callPostponePeriodApi(this.state.before_pjtcode)
        }else{
            $('.pv_bottom').hide()
            $('.elong').hide()
            $('.bt_ty6').hide()
            $('.cancel_ty2').hide()
        }
        setTimeout(function() {
            //연구 분야 리스트 호출
            this.callSubCodeApi('RF')
            }.bind(this),1000
        );

        // datasource 리스트 호출
        this.callDataSrceListApi()
        // Software tool 리스트 호출
        this.callSWtoolListApi()

        $('.wel_bt').click(function(){
            $('.pop_project5').fadeIn();		
            $("html").css("overflow","hidden");
            $("body").css("overflow","hidden");
        });

        $('.layer_Close').hide()

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
        .catch( response => {this.sweetalert('작업중 오류가 발생하였습니다.', response, 'error', '닫기');return false;} );
    }

    // 연장 연구기간 호출
    callPostponePeriodApi = async (pjtcode) => {
        try {
            axios.post('/api/Myproject?type=Postpone', {
                is_Pjt_code : pjtcode
            })
            .then( response => {
                try {
                    if(response.data.json[0] != undefined){
                        var startday = response.data.json[0].delay_start_date
                        var endday = response.data.json[0].delay_end_date
                        startday = startday.substr(0,8)
                        endday = endday.substr(0,8)

                        $('#postpone').show()

                        $('#startday_val2').val(startday)
                        $('#endday_val2').val(endday)

                        var start_year = startday.substr(0,4)
                        var start_month = startday.substr(4,2)
                        var start_day = startday.substr(6,2)
                        var post_startday = start_year + '.' + start_month + '.' +start_day

                        // this.state.endday = endday.substr(0,8)
                        var end_year = endday.substr(0,4)
                        var end_month = endday.substr(4,2)
                        var end_day = endday.substr(6,2)
                        var post_endday = end_year + '.' + end_month + '.' +end_day

                        var poststat = ''
                        var delay_flag = response.data.json[0].delay_flag
                        poststat = ' (승인대기)'
                        if(delay_flag == '/W'){
                        }else if(delay_flag == '/A'){
                            poststat = ' <span1>(승인)</span1>'
                        }else if(delay_flag == '/R'){
                            poststat = ' <span2>(반려)<span2>'
                        }

                        $('#postpone_prepend').empty()
                        $('#postpone_prepend').append(post_startday + '~'+post_endday+poststat)

                    }
                    
                } catch (error) {
                    this.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기')
                }
            })
            .catch( response => {return false;} );
        } catch (error) {
            this.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기')            
        }
    }

    // 프로젝트 상세 댓글 정보 호출
    callReplyListApi = async (pjtcode) => {

        try {
            //댓글리스트 호출
            axios.post('/api/Resrchpjt?type=read_reply', {
                is_Pjt_code : pjtcode
            })
            .then( response => {
                try {

                    this.setState({ responseReplyList: response });
                    this.setState({ append_ReplyList: this.ReplyListAppend() });
                } catch (error) {
                    this.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기')
                }
            })
            .catch( response => {return false;} );
        } catch (error) {
            this.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기')            
        }
    };

    // 프로젝트 상세 댓글 정보 append
    ReplyListAppend = () => {
        try {
            let result = []
            const size = this.state.responseReplyList.data.json.length;
            
            for(let i=0; i<size; i++){
                var reply_user_name = this.state.responseReplyList.data.json[i].reply_user_name
                var reply_contents = this.state.responseReplyList.data.json[i].reply_contents
                var update_date = this.state.responseReplyList.data.json[i].update_date
                var reply_code = this.state.responseReplyList.data.json[i].reply_code
                var reply_user_email = this.state.responseReplyList.data.json[i].reply_user_email
                
                result.push(
                    <li>
                        <h3>{reply_user_name}<span>{update_date}</span>
                            <a href="javascript:" id={reply_code} email={reply_user_email} className="c_del c_del_s" onClick={(e) => this.submitReplyClick('delete_reply', e)} ></a>
                        </h3>
                        <p>{reply_contents}</p>
                    </li>
                )
            }
            return result
        } catch (error) {
            this.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기')
        }
    }

    // 댓글 입력시 insert
    submitReplyClick = async (type, e) => {
        var reply_code = e.target.getAttribute('id')
        
        if(type == 'delete_reply'){
            var cookie_userid = this.state.userid
            if(e.target.getAttribute('email') == cookie_userid){
                var callReplyListApi = this.callReplyListApi;
                var sweetalert = this.sweetalert;
                var before_pjtcode = this.state.before_pjtcode;

                this.sweetalertDelete('정말 삭제하시겠습니까?', function() {
                    axios.post('/api/Resrchpjt?type='+type, {
                        is_Reply_code : reply_code,
                    })
                    .then( response => {
                        // 댓글 정보 호출
                        callReplyListApi(before_pjtcode)
                    })
                    .catch( error => { sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기');} );
                })
            }else{
                this.sweetalert('내가 작성한 댓글만 삭제 가능합니다.', '', 'info', '닫기')
            }
        }else{
            this.reply_val_checker = $('#reply_val').val();
            var cookie_username = this.state.usernm
            var cookie_userid = this.state.userid
    
            axios.post('/api/Resrchpjt?type='+type, {
                is_reply_contents: this.reply_val_checker,
                is_Pjt_code : this.state.before_pjtcode,
                is_Username : cookie_username,
                is_Email : cookie_userid,
                is_Reply_code : reply_code,
            })
            .then( response => {
                // 댓글 정보 호출
                this.callReplyListApi(this.state.before_pjtcode)
            })
            .catch( response => { this.sweetalert('작업중 오류가 발생하였습니다.', response, 'error', '닫기')} );
        }
    };

    // 프로젝트 상세 연구파일 정보 호출
    callUploadFileInfoApi = async (pjtcode) => {
        try {
            const response = await fetch('/api/Resrchpjt?type=uploadfile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ is_Pjt_code : pjtcode}),
            });

                const response2 = await axios.get('/api/cmpathinfo');
                var node_url = response2.data.node_url;
                const body = await response.json();
                this.setState({ responseUploadfileInfo: body });
                this.setState({ append_UploadfileInfo: this.UploadFileInfoAppend(node_url) });

        } catch (error) {
            this.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기')            
        }
    };

    // 프로젝트 상세 연구파일 정보 호출 append
    UploadFileInfoAppend = (node_url) => {
        try {
            let result = []

            const size = this.state.responseUploadfileInfo.json.length;
            if(size > 0){
                $('#empty_file').hide()
            }
            for(let i=0; i<size; i++){

                var file_name = this.state.responseUploadfileInfo.json[i].file_name
                var reg_user = this.state.responseUploadfileInfo.json[i].reg_user
                var reg_date = this.state.responseUploadfileInfo.json[i].reg_date
                var path = node_url+ '/'+file_name;

                var cnt = (i+1)+''
                if(i<10){
                    cnt = '0'+cnt
                }

                    result.push(
                    <tr id ={file_name}> 
                        <th>연구파일{cnt}</th>
                        <td className="fileBox fileBox1">
                            <label htmlFor='tmpid' className="btn_file">파일선택</label>
                            <input type="text" id='tmpid' className="fileName fileName1" readOnly="readonly" placeholder={file_name}/>
                            <input type="file" id={cnt} className="uploadBtn uploadBtn1" onChange={e => this.handleFileInput(e)}/>
                            <a href={path} download={file_name} className="f_down"></a>
                            <a href="#n" id ={file_name} onClick={(e) => this.fileDelete('asis',e)} className="c_del"></a>
                        </td>
                    </tr>
                    )
                    $('#file_append0').append('<input id="'+file_name+'" type="hidden" name="arr_filename" value="'+file_name+'"/>')
                    $('#file_append0').append('<input id="'+reg_user+'" type="hidden" name="arr_reg_user" value="'+reg_user+'"/>')
                    $('#file_append0').append('<input id="'+reg_date+'" type="hidden" name="arr_reg_date" value="'+reg_date+'"/>')
            }
            return result
        } catch (error) {
            this.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기')
        }
    }

    // 파일삭제
    fileDelete = (type, e) => {
        var tmp_id = e.target.id
        if(type == 'asis'){
            this.sweetalertDelete('정말 삭제하시겠습니까?', function() {
                $("input[id='"+tmp_id+"']").remove()
                $("tr[id='"+tmp_id+"']").remove()
                
                $("input[classname='"+tmp_id+"']").remove()
                $("tr[className='"+tmp_id+"']").css("display", "none")
                if($(".fileBox1").length == 0){
                    $('#empty_file').show()
                }
            })
        }else{
            $("tr[class='"+tmp_id+"']").remove()
            if($(".fileBox1").length == 0){
                $('#empty_file').show()
            }
        }
    }

    // 프로젝트 상세 SWtool 정보 호출
    callSWtoolInfoApi = async (pjtcode) => {
        try {
            const response = await fetch('/api/Resrchpjt?type=SWtool', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ is_Pjt_code : pjtcode}),
            });
            
            const body = await response.json();
            this.setState({ responseSWtoolInfo: body });
            this.SWtoolInfoAppend()
            this.setState({ analysis_SWtoolInfo: this.SWtoolInfoAppend2('anly') });
        } catch (error) {
            this.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기')            
        }
    };

    // 프로젝트 상세 SWtool 정보 append
    SWtoolInfoAppend = () => {
        try {
            const size = this.state.responseSWtoolInfo.json.length;
            if(size > 0) {
                $('#empty_swt').hide()
            }
            for(let i=0; i<size; i++){
                var swtoodname = this.state.responseSWtoolInfo.json[i].swt_toolname
                var imgpath = this.state.responseSWtoolInfo.json[i].swt_imagepath
                var code = this.state.responseSWtoolInfo.json[i].swt_code
                var usw_flag = this.state.responseSWtoolInfo.json[i].usw_flag

                imgpath = '/image/'+imgpath

                var txt = '(승인대기)'
                if(usw_flag == '/W'){
                    //승인대기
                    this.state.SwToolWaitAcceptList = this.state.SwToolWaitAcceptList+code+',';
                }else if(usw_flag == '/A'){
                    txt = '<span1>(승인)</span1>'
                    this.state.SwToolModiAcceptList = this.state.SwToolModiAcceptList+code+',';
                }else if(usw_flag == '/R'){
                    txt = '<span2>(반려)<span2>'
                    this.state.SwToolModiAcceptList = this.state.SwToolModiAcceptList+code+',';
                }

                $("#appendSWToolList").append(
                    '<tr id="'+code+'"><th><img src="'+imgpath+'" alt=""/></th><td>'+swtoodname+'&nbsp;'+txt+'</td><input id="arr_Swt_code" type="hidden" name="arr_Swt_code" value='+code+' /><input id="arr_Swt_name" type="hidden" name="arr_Swt_name" value='+swtoodname+' /><input id="arr_Swt_flag" type="hidden" name="arr_Swt_flag" value='+usw_flag+' /></tr>'
                )    
                this.state.SwToolModiList = this.state.SwToolModiList+code+',';
            }
        } catch (error) {
            this.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기')
        }
    }

    // 분석하기 팝업에서 프로젝트 상세 SWtool 정보 append
    SWtoolInfoAppend2 = (type) => {
        try {
            let result = []

            const size = this.state.responseSWtoolInfo.json.length;
            for(let i=0; i<size; i++){
                var imgpath = this.state.responseSWtoolInfo.json[i].swt_imagepath
                var usw_flag = this.state.responseSWtoolInfo.json[i].usw_flag
                var swt_code = this.state.responseSWtoolInfo.json[i].swt_code

                imgpath = '/image/'+imgpath

                var txt = '(승인대기)'
                if(usw_flag == '/W'){
                    //승인대기
                }else if(usw_flag == '/A'){
                    txt = <span1>(승인)</span1>
                }else if(usw_flag == '/R'){
                    txt = <span2>(반려)</span2>
                }
                if(type == 'anly'){
                    if(usw_flag == '/A'){
                        result.push(
                            <tr id={swt_code} swt_code={swt_code} name={this.state.responseSWtoolInfo.json[i].swt_toolname} 
                            onMouseEnter={e => this.InfoHover(swt_code,e)} onMouseLeave={e => this.InfoLeave(swt_code,e)} onClick={(e) => this.infoClick2(e)}>
                                <th swt_code={swt_code}><img src={imgpath} alt="" /></th>
                                <td swt_code={swt_code}>{this.state.responseSWtoolInfo.json[i].swt_toolname}
                                    &nbsp;{txt}
                                </td>
                            </tr>
                        )
                    }
                }else{
                    result.push(
                        <tr>
                            <th><img src={imgpath} alt="" /></th>
                            <td>{this.state.responseSWtoolInfo.json[i].swt_toolname}
                                &nbsp;{txt}
                            </td>
                        </tr>
                    )
                }//else
            }
            return result
        } catch (error) {
            this.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기')
        }
    }

    // 프로젝트 상세 datasource 정보 호출
    callDataSrceInfoApi = async (pjtcode) => {
        try {
            const response = await fetch('/api/Resrchpjt?type=datasrce', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ is_Pjt_code : pjtcode}),
            });
            
            const body = await response.json();
            this.setState({ responseDataSrceInfo: body });
            this.DataSrceInfoAppend()
            this.setState({ analysis_DataSrceInfo: this.DataSrceInfoAppend2('anly') });
        } catch (error) {
            this.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기')            
        }
    };

    // 프로젝트 상세 datasource 정보 append
    DataSrceInfoAppend = () => {
        try {
            const size = this.state.responseDataSrceInfo.json.length;
            this.state.DataSourceModiData = new Array(size);
            if(size > 0) {
                $('#empty_ds').hide()
            }
            for(let i=0; i<size; i++){
                var imgpath = this.state.responseDataSrceInfo.json[i].ds_imagepath
                var dbname = this.state.responseDataSrceInfo.json[i].ds_dbname
                var holdorg = this.state.responseDataSrceInfo.json[i].ds_holdorg
                var type = this.state.responseDataSrceInfo.json[i].ds_typenm
                var code = this.state.responseDataSrceInfo.json[i].ds_code
                var uds_flag = this.state.responseDataSrceInfo.json[i].uds_flag

                imgpath = '/image/'+imgpath

                var txt = '(승인대기)'
                if(uds_flag == '/W'){
                    //승인대기
                    this.state.DataSourceWaitAcceptList = this.state.DataSourceWaitAcceptList+code+',';
                }else if(uds_flag == '/A'){
                    txt = '<span1>(승인)</span1>'
                    this.state.DataSourceModiAcceptList = this.state.DataSourceModiAcceptList+code+',';
                }else if(uds_flag == '/R'){
                    txt = '<span2>(반려)<span2>'
                    this.state.DataSourceModiAcceptList = this.state.DataSourceModiAcceptList+code+',';
                }
                
                $("#appendSrceList").append(    
                    '<tr id="'+code+'"><th><img src="'+imgpath+'" alt=""/></th><td>'+dbname+' ('+holdorg+' / '+type+')&nbsp;'+txt+'</td><input id="arr_Ds_code" type="hidden" name="arr_Ds_code" value="'+code+'" /><input id="arr_Ds_name" type="hidden" name="arr_Ds_name" value="'+dbname+'" /><input id="arr_Ds_flag" type="hidden" name="arr_Ds_flag" value="'+uds_flag+'" /></tr>'
                )
                this.state.DataSourceModiList = this.state.DataSourceModiList+code+',';
            }
        } catch (error) {
            this.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기')
        }
    }

    // 분석하기 팝업에서 프로젝트 상세 datasource 정보 append
    DataSrceInfoAppend2 = (type) => {
        try {
            let result = []

            const size = this.state.responseDataSrceInfo.json.length;
            for(let i=0; i<size; i++){
                var imgpath = this.state.responseDataSrceInfo.json[i].ds_imagepath
                var uds_flag = this.state.responseDataSrceInfo.json[i].uds_flag
                var ds_code = this.state.responseDataSrceInfo.json[i].ds_code
                
                imgpath = '/image/'+imgpath

                var txt = '(승인대기)'
                if(uds_flag == '/W'){
                    //승인대기
                }else if(uds_flag == '/A'){
                    txt = <span1>(승인)</span1>
                }else if(uds_flag == '/R'){
                    txt = <span2>(반려)</span2>
                }
                
                if(type == 'anly'){
                    if(uds_flag == '/A'){
                        result.push(
                            <tr id={ds_code} name={this.state.responseDataSrceInfo.json[i].ds_dbname} onMouseEnter={e => this.InfoHover(ds_code,e)} onMouseLeave={e => this.InfoLeave(ds_code,e)} onClick={(e) => this.infoClick(ds_code,e)}>
                                <th><img src={imgpath} alt="" /></th>
                                <td>{this.state.responseDataSrceInfo.json[i].ds_dbname} ({this.state.responseDataSrceInfo.json[i].ds_holdorg} / {this.state.responseDataSrceInfo.json[i].ds_typenm})
                                    &nbsp;{txt}
                                </td>
                            </tr>
                        )
                    }
                }else{
                    result.push(
                        <tr>
                            <th><img src={imgpath} alt="" /></th>
                            <td>{this.state.responseDataSrceInfo.json[i].ds_dbname} ({this.state.responseDataSrceInfo.json[i].ds_holdorg} / {this.state.responseDataSrceInfo.json[i].ds_typenm})
                                &nbsp;{txt}
                            </td>
                        </tr>
                    )
                }//else
            }//for
            return result
        } catch (error) {
            this.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기')
        }
    }

    // 프로젝트 상세 공동연구자 리스트 호출
    callparticipantInfoApi = async (pjtcode) => {
        try {
            const response = await fetch('/api/Resrchpjt?type=prtipant', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({ is_Pjt_code : pjtcode}),
            });
            
            const body = await response.json();
            this.setState({ responseParticipantInfo: body });
            this.ParticipantInfoAppend()
        } catch (error) {
            this.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기')            
        }
    };

    // 프로젝트 상세 공동연구자 리스트 append
    ParticipantInfoAppend = () => {
        // var append_text = $('#Ptcipant_val').val()
        try {
            const size = this.state.responseParticipantInfo.json.length;
            for(let i=0; i<size; i++){
                var username = this.state.responseParticipantInfo.json[i].ptc_username
                var useremail = this.state.responseParticipantInfo.json[i].ptc_useremail
                var useremail2 = useremail.replace('@','').replace('.','')
                $('#ptcipant_append').append('<input id="arr_ptcipantEmail" type="hidden" name="arr_ptcipantEmail"  class ='+useremail2+' value="'+this.state.responseParticipantInfo.json[i].ptc_useremail+'"}/>')
                $('#ptcipant_append').append('<input id="arr_ptcipantName" type="hidden" name="arr_ptcipantName" class ='+useremail2+' value="'+this.state.responseParticipantInfo.json[i].ptc_username+'"/>')
                $('#ptcipant_append').append('<input id="arr_ptcipantflag" type="hidden" name="arr_ptcipantflag" class ='+useremail2+' value="'+this.state.responseParticipantInfo.json[i].ptc_flag+'"/>')

                var flag = this.state.responseParticipantInfo.json[i].ptc_flag
                var txt = '(승인대기)'
                if(flag == '/W'){
                    //승인대기
                }else if(flag == '/A'){
                    txt = '(승인)'
                }else if(flag == '/R'){
                    txt = '(반려)'
                }

                this.setState({ append_pctAddList: this.pctAddListAppend(username, useremail, txt)})
            }
        } catch (error) {
            this.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기')
        }
    }

    // 프로젝트 상세 연구정보 호출
    callResrchInfoApi = async (pjtcode) => {
        try {
            const response = await fetch('/api/Resrchpjt?type=detail', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({ is_Pjt_code : pjtcode}),
            });
            
            const body = await response.json();
            this.setState({ responseProjectInfo: body });
            this.ResrchpjtInfoAppend()
        } catch (error) {
            this.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기')            
        }
    };

    // 프로젝트 상세 연구정보 정보 append
    ResrchpjtInfoAppend = () => {
        this.state.reg_date = this.state.responseProjectInfo.json[0].reg_date

        var date = this.state.responseProjectInfo.json[0].pjt_start_date
        var year = date.substr(0,4)
        var month = date.substr(4,2)
        var day = date.substr(6,2)
        var pjt_startdate = year +month+day

        date = this.state.responseProjectInfo.json[0].pjt_end_date
        year = date.substr(0,4)
        month = date.substr(4,2)
        day = date.substr(6,2)
        var pjt_enddate = year+month+day
        
        $('#pjtname_val').val(this.state.responseProjectInfo.json[0].pjt_name)
        this.state.pjt_name = this.state.responseProjectInfo.json[0].pjt_name

        $('#startday_val').val(pjt_startdate)
        $('#endday_val').val(pjt_enddate)
        this.state.pjt_period = pjt_startdate+'~'+pjt_enddate

        $('#resrch_contents').val(this.state.responseProjectInfo.json[0].pjt_contents)
        this.state.pjt_field_cd = this.state.responseProjectInfo.json[0].pjt_field_cd

        if(this.state.responseProjectInfo.json[0].pjt_type == 'public'){
            $("input[name='is_Type']:first").prop('checked', true);
        }else{
            $("input[name='is_Type']:last").prop('checked', true);
        }

        this.state.pjt_status = this.state.responseProjectInfo.json[0].pjt_status_cd
        if(this.state.responseProjectInfo.json[0].pjt_status_cd != 'RS2' && this.state.responseProjectInfo.json[0].pjt_status_cd != 'RS4'){
            $('.elong').hide()
            $('.bt_ty6').hide()
        }
        if(this.state.flag == 'modify' && this.state.responseProjectInfo.json[0].pjt_status_cd != 'RS1'){
            this.state.showCalendarDisable = 'Y'
        }
        //프로젝트 상태가 등록
        if(!this.state.flag == 'modify' || (this.state.flag == 'modify' && this.state.responseProjectInfo.json[0].pjt_status_cd != 'RS1' && this.state.responseProjectInfo.json[0].pjt_status_cd != 'RS2')){
            $('.cancel_ty2').hide()
        }
    }

    //취소 버튼 클릭시
    CencelClick = async (e) => {
        var this2 = this
        this.sweetalertCancel('정말 취소하시겠습니까?', function() {
            axios.post('/api/Myproject?type=updatePjtStatus', {
                is_Pjt_code : this2.state.before_pjtcode,
                is_Pjt_status : 'RS5',
            })
            .then( response => {
                this2.sweetalertSucc('프로젝트 취소가 완료되었습니다.', false)

                this2.saveLogMessage('LG6','프로젝트를 취소했습니다. 프로젝트명 : '+this2.state.responseProjectInfo.json[0].pjt_name+' 프로젝트 코드 : '+this2.state.before_pjtcode)
                axios.get('/api/cmpathinfo')
                .then(function (response) {
                    setTimeout(function() {
                        window.location.href = response.data.home_url+'/rsc-pjs';
                        }.bind(this2),1500
                    );
                })
            })
            .catch( response => {this2.sweetalert('작업중 오류가 발생하였습니다.', response, 'error', '닫기'); return false;} );
        })
    }

    // 저장 버튼 클릭시 validate check
    submitClick = async (type, e) => {

        var date = new Date()
        var y_str = date.getFullYear().toString();
        
        var month = date.getMonth()+1
        if(month < 10) month = '0' + month
        var m_str = month.toString();
        var day = date.getDate()
        if(day < 10) day = '0' + day
        var d_str = day.toString();

        var hour = date.getHours()
        if(hour < 10) hour = '0' + hour
        var min = date.getMinutes()
        if(min < 10) min = '0' + min
        var sec = date.getSeconds()
        if(sec < 10) sec = '0' + sec

        // 프로젝트 코드생성
        this.state.pjct_code = 'PJ'+y_str+m_str+d_str+hour+min+sec

        this.pjtname_val_checker = $('#pjtname_val').val(); //연구명
        this.owner_val_checker = $('#owner_val').val(); //책임연구자:글쓴이 => 로그인 체크

        this.type_val_checker = $("input[name='is_Type']:checked").val(); //check된 값을
        $('#is_TypeCheck').val(this.type_val_checker);                    //새로운 form 변수에 세팅

        this.startday_val_checker = $('#startday_val').val();
        this.endday_val_checker = $('#endday_val').val();

        this.resrch_contents_checker = $('#resrch_contents').val();

        //사용 DataSource 리스트 배열에 저장
        this.arr_Ds_code_val_checker = $('#arr_Ds_code').val();
        var DataSourceArr = $("input[name='arr_Ds_code']").length;
        this.state.DataSourceData = new Array(DataSourceArr);
        for(var i=0; i<DataSourceArr; i++){                          
            this.state.DataSourceData[i] = $("input[name='arr_Ds_code']")[i].value;
            var ds_name = $("input[name='arr_Ds_name']")[i].value;
            this.saveLogMessage('LG3','사용 Data Source를 등록했습니다. Data Source 코드 : '+this.state.DataSourceData[i]+' Data Source 명 : '+ds_name+' 프로젝트 코드 :'+this.state.pjct_code)
            //사용 DataSource 승인 flag 리스트 배열에 저장
            this.state.DataSourceflagData[i] = $("input[name='arr_Ds_flag']")[i].value;
            if(this.state.DataSourceflagData[i] == '/W'){
                this.state.datasrceWflag = true
            }
        }

        //사용 SoftWare Tool 리스트 배열에 저장
        this.arr_Swt_code_val_checker = $('#arr_Swt_code').val();
        var SwtoolArr = $("input[name='arr_Swt_code']").length;
        this.state.SwtooltData = new Array(SwtoolArr);
        for(var i=0; i<SwtoolArr; i++){                          
            this.state.SwtooltData[i] = $("input[name='arr_Swt_code']")[i].value;
            var swt_name = $("input[name='arr_Swt_name']")[i].value;
            this.saveLogMessage('LG2','사용 Software tool을 등록했습니다. softwaretool 코드 : '+this.state.SwtooltData[i]+' softwaretool 명 : '+swt_name+' 프로젝트 코드 :'+this.state.pjct_code)
            //사용 SoftWare Tool 승인 flag 리스트 배열에 저장
            this.state.SwtooltflagData[i] = $("input[name='arr_Swt_flag']")[i].value;
            if(this.state.SwtooltflagData[i] == '/W'){
                this.state.swtoolWflag = true
            }
        }

        //공동연구자 리스트 배열에 저장
        this.arr_ptcipant_val_checker = $('#arr_ptcipantEmail').val();
        var ptcipantArr = $("input[name='arr_ptcipantEmail']").length;
        this.state.ptcipantDataEmail = new Array(ptcipantArr);
        this.state.ptcipantDataName = new Array(ptcipantArr);
        this.state.ptcipantDataFlag = new Array(ptcipantArr);
        
        for(var i=0; i<ptcipantArr; i++){                          
            this.state.ptcipantDataEmail[i] = $("input[name='arr_ptcipantEmail']")[i].value;
            this.state.ptcipantDataName[i] = $("input[name='arr_ptcipantName']")[i].value;
            this.state.ptcipantDataFlag[i] = $("input[name='arr_ptcipantflag']")[i].value;
            this.saveLogMessage('LG4', this.state.ptcipantDataName[i]+'('+this.state.ptcipantDataEmail[i]+') 님을 공동연구자로 신청했습니다. softwaretool 코드 : '+this.state.SwtooltData[i]+' 프로젝트 코드 :'+this.state.pjct_code)
        }
        
        //업로드한 파일명을 배열에 저장
        var uploadfileArr = $("input[name='arr_filename']").length;
        this.state.uploadFileName = new Array(uploadfileArr);
        for(var i=0; i<uploadfileArr; i++){                          
            this.state.uploadFileName[i] = $("input[name='arr_filename']")[i].value;
            this.state.uploadFileRegdate[i] = $("input[name='arr_reg_date']")[i].value;
            this.state.uploadFileReguser[i] = $("input[name='arr_reg_user']")[i].value;
        }

        this.fnValidate = (e) => {
            if(this.owner_val_checker === '') {
                this.sweetalert('사용자 정보가 없습니다.', '로그인 후 이용해주세요', 'warning', '닫기')
                return false;
            }
            if(this.pjtname_val_checker === '') {
                $('#pjtname_val').addClass('border_validate_err');
                this.sweetalert('입력값이 유효하지 않습니다.', '연구명을 다시 확인해주세요.', 'warning', '닫기')
                return false;
            }
            $('#pjtname_val').removeClass('border_validate_err');
            if(this.type_val_checker === '' || this.type_val_checker === undefined) {
                $('#type_val').addClass('border_validate_err');
                this.sweetalert('입력값이 유효하지 않습니다.', 'public/private 구분을 확인해주세요.', 'warning', '닫기')
                return false;
            }
            $('#type_val').removeClass('border_validate_err');
            if(this.startday_val_checker === '' || this.endday_val_checker === '') {
                $('#startday_val').addClass('border_validate_err');
                $('#endday_val').addClass('border_validate_err');
                this.sweetalert('입력값이 유효하지 않습니다.', '연구기간을 확인해주세요.', 'warning', '닫기')
                return false;
            }
            $('#startday_val').removeClass('border_validate_err');
            $('#endday_val').removeClass('border_validate_err');
            if(this.state.ResrchFld_check === '') {
                $('.rsc_field_a').addClass('border_validate_err');
                this.sweetalert('입력값이 유효하지 않습니다.', '연구분야를 확인해주세요.', 'warning', '닫기')
                return false;
            }
            $('.rsc_field_a').removeClass('border_validate_err');

            if(this.resrch_contents_checker === '') {
                $('#resrch_contents').addClass('border_validate_err');
                this.sweetalert('입력값이 유효하지 않습니다.', '연구내용을 다시 확인해주세요.', 'warning', '닫기')
                return false;
            }
            $('#resrch_contents').removeClass('border_validate_err');

            if(this.arr_Ds_code_val_checker === ''|| this.arr_Ds_code_val_checker === undefined) {
                this.sweetalert('입력값이 유효하지 않습니다.', '사용 DataSource를 다시 확인해주세요.', 'warning', '닫기')
                return false;
            }
            
            if(this.arr_Swt_code_val_checker === ''|| this.arr_Swt_code_val_checker === undefined) {
                this.sweetalert('입력값이 유효하지 않습니다.', '사용 SoftWare tool을 다시 확인해주세요.', 'warning', '닫기')
                return false;
            }

            $('#arr_ptcipant').removeClass('border_validate_err');

            return true;
        }

        //연구정보 유효성 체크
        if(this.fnValidate()){

            $('#is_ProjectCd').val(this.state.pjct_code)

            this.insertDataSource()

        }//fnValidate end
        
    };

    //alert 기본 함수
    sweetalert = (title, contents, icon, confirmButtonText) => {
        Swal.fire({
            title: title,
            text: contents,
            icon: icon,
            confirmButtonText: confirmButtonText
          })
    }

    //alert 성공 함수
    sweetalertSucc = (title, showConfirmButton) => {
        Swal.fire({
            position: 'bottom-end',
            icon: 'success',
            title: title,
            showConfirmButton: showConfirmButton,
            timer: 1000
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

    //alert 취소 함수
    sweetalertCancel = (title, callbackFunc) => {
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
                'Canceled!',
                '취소되었습니다.',
                'success'
              )
            }else{
                return false;
            }
            callbackFunc()
          })
    }

    //data source 삽입
    insertDataSource = (e) => {
        // 사용 DataSource 저장
        axios.post('/api/Myproject?type=dsInsert', {
            arr_DataSourceData: this.state.DataSourceData,
            arr_DataSourceflagData: this.state.DataSourceflagData,
            is_Email : this.state.userid,
            is_ProjectCd : this.state.pjct_code,
            is_Regdate : this.state.reg_date,
        })
        .then( response => {
            this.insertSwTool()
        })
        .catch( response => {this.insertRollback('insertDataSource'); return false;} );
    }

    //software tools 삽입
    insertSwTool = (e) => {
        // 사용 SoftWare tool 저장
        axios.post('/api/Myproject?type=SwtInsert', {
            arr_SwtooltData: this.state.SwtooltData,
            arr_SwtooltflagData: this.state.SwtooltflagData,
            is_Email : this.state.userid,
            is_ProjectCd : this.state.pjct_code,
            is_Regdate : this.state.reg_date,
        })
        .then( response => {
            this.updateSwToolUrl()
            this.insertParticipant()
        })
        .catch( response => {this.insertRollback('insertSwTool'); return false;} );
    }

    //software tools URL 수정
    updateSwToolUrl = (e) => {
        // 사용 SoftWare tool 저장
        axios.post('/api/Myproject?type=SwtUpdateUrl', {
            is_ProjectCd : this.state.pjct_code,
            is_BeforeProjectCd : this.state.before_pjtcode,
        })
        .then( response => {
        })
        .catch( error => {this.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기');return false;} );
    }

    //공동연구자 삽입
    insertParticipant = (e) => {
        if(this.state.ptcipantDataEmail == ''){
            this.insertUploadFile()
        }else{
            // 공동연구자 저장
            axios.post('/api/Myproject?type=ptcipantInsert', {
                arr_PtcipantDataEmail: this.state.ptcipantDataEmail,
                arr_PtcipantDataName: this.state.ptcipantDataName,
                arr_PtcipantDataFlag: this.state.ptcipantDataFlag,
                is_Email : this.state.userid,
                is_ProjectCd : this.state.pjct_code,
                is_Regdate : this.state.reg_date,
            })
            .then( response => {
                this.insertUploadFile()
            })
            .catch( response => {this.insertRollback('insertParticipant'); return false;} );   
        }
    }

    //연구파일 삽입
    insertUploadFile = (e) => {
        if(this.state.uploadFileName == ''){
            this.updateReplyCode(this.state.pjct_code, this.state.before_pjtcode)
        }else{
            try {
                axios.post('/api/Myproject?type=uploadfile', {
                    arr_UploadFile: this.state.uploadFileName,
                    arr_UploadFileDate: this.state.uploadFileRegdate,
                    arr_UploadFileUser: this.state.uploadFileReguser,
                    is_Email : this.state.userid,
                    is_ProjectCd : this.state.pjct_code,
                    is_Regdate : this.state.reg_date,
                })
                .then( response => {
                    this.updateReplyCode(this.state.pjct_code, this.state.before_pjtcode)
                })
                .catch( response => {this.insertRollback('insertUploadFile'); return false;} );   
                
            } catch (error) {
                this.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기')
            }
        }
    }

    //댓글 삽입
    updateReplyCode = (pjtcd, bofore_pjtcd, e) => {
        try {
            axios.post('/api/Myproject?type=update_reply', {
                is_ProjectCd : pjtcd,
                is_before_ProjectCd : bofore_pjtcd
            })
            .then( response => {
                this.updatePostponeCode(this.state.pjct_code, this.state.before_pjtcode)
            })
            .catch( response => {this.insertRollback('updateReplyCode'); return false;} );   
            
        } catch (error) {
            this.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기')
        }
    }

    //연장 연구기간 pjtcode 변경
    updatePostponeCode = (pjtcd, bofore_pjtcd, e) => {
        try {
            axios.post('/api/Myproject?type=update_postpone', {
                is_ProjectCd : pjtcd,
                is_before_ProjectCd : bofore_pjtcd
            })
            .then( response => {
                this.insertResrchInfo()
            })
            .catch( response => {this.insertRollback('updatePostponeCode'); return false;} );   
            
        } catch (error) {
            this.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기')
        }
    }

    //연구 정보 삽입
    insertResrchInfo = async (e) => {
        //연구정보 저장 후 리스트로 이동
        var jsonstr = $("form[name='frm']").serialize();
        //특수문자 깨짐 해결
        jsonstr = decodeURIComponent(jsonstr);
        var Json_form = JSON.stringify(jsonstr).replace(/\"/gi,'')
        Json_form = "{\"" +Json_form.replace(/\&/g,'\",\"').replace(/=/gi,'\":"')+"\"}";

        try {
            const response = await fetch('/api/Myproject?type=save', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                //한글 디코딩
                body: Json_form,
            });
            const body = await response.text();
            if(body == "succ"){
                if(this.state.flag == 'modify'){
                    this.sweetalertSucc('연구정보 수정이 완료되었습니다.', false)
                    this.deleteBefore();
                    this.saveLogMessage('LG1','프로젝트를 수정했습니다. 프로젝트명 : '+this.state.responseProjectInfo.json[0].pjt_name+' 프로젝트 코드 : '+this.state.pjct_code)
                }else{
                    this.sweetalertSucc('연구정보 저장이 완료되었습니다.', false)
                    var pjt_name = $('#pjtname_val').val()
                    this.saveLogMessage('LG1','프로젝트를 등록했습니다. 프로젝트명 : '+pjt_name+' 프로젝트 코드 : '+this.state.pjct_code)
                }
                //메시지 발송
                this.pushMessage()
                const response = await axios.get('/api/cmpathinfo');
                setTimeout(function() {
                    window.location.href = response.data.home_url;
                    }.bind(this),1500
                );

            }else{
                this.insertRollback('insertResrchInfo');
                this.sweetalert('작업중 오류가 발생하였습니다.', body, 'error', '닫기');      
            }  
        } catch (error) {
            this.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기');            
        }
    }//end insertResrchInfo

    //메시지 발송
    pushMessage = (e) => {
    
        var cookie_username = this.state.usernm
        var date = new Date()
        var y_str = date.getFullYear().toString();
        
        var month = date.getMonth()+1
        if(month < 10) month = '0' + month
        var m_str = month.toString();
        var day = date.getDate()
        if(day < 10) day = '0' + day
        var d_str = day.toString();

        var hour = date.getHours()
        if(hour < 10) hour = '0' + hour
        var min = date.getMinutes()
        if(min < 10) min = '0' + min

        //datasouce가 하나라도 승인대기라면 메시지 전송
        if(this.state.datasrceWflag){
            // 알림 코드생성
            var sec = date.getSeconds()-2
            this.state.notice_code = 'NT'+y_str+m_str+d_str+hour+min+sec
            if(sec < 10) sec = '0' + sec
            this.sendNoticeMessage('admin', cookie_username+'님이 Datasource 사용을 승인요청하였습니다.', this.state.notice_code)
            this.sendEmailtoAdmin('admin', 'rtrod Datasource 사용 승인요청', cookie_username+'님이 Datasource 사용을 승인요청하였습니다.')
        }

        //software tool이 하나라도 승인대기라면 메시지 전송
        if(this.state.swtoolWflag){
            // 알림 코드생성
            var sec = date.getSeconds()-1
            this.state.notice_code = 'NT'+y_str+m_str+d_str+hour+min+sec
            if(sec < 10) sec = '0' + sec
            this.sendNoticeMessage('admin', cookie_username+'님이 Software tool 사용을 승인요청하였습니다.', this.state.notice_code)
            this.sendEmailtoAdmin('admin', 'rtrod Software tool 사용 승인요청', cookie_username+'님이 Software tool 사용을 승인요청하였습니다.')
        }

        var ptcipantArr = $("input[name='arr_ptcipantEmail']").length;
        
        //공동연구자가 승인대기라면 메시지 전송
        for(var i=0; i<ptcipantArr; i++){                          
            this.state.ptcipantDataName[i] = $("input[name='arr_ptcipantName']")[i].value;

            if($("input[name='arr_ptcipantflag']")[i].value == '/W'){
                var sec = date.getSeconds()+i
                if(sec < 10) sec = '0' + sec
    
                // 알림 코드생성
                this.state.notice_code = 'NT'+y_str+m_str+d_str+hour+min+sec
                this.sendNoticeMessage(this.state.ptcipantDataEmail[i], cookie_username+'님이 '+this.state.pjt_name+' 프로젝트 공동연구자 참여를 요청했습니다.', this.state.notice_code)
                this.sendEmail(this.state.ptcipantDataEmail[i], 'rtrod 프로젝트 공동연구자 참여 요청', cookie_username+'님이 '+this.state.pjt_name+' 프로젝트 공동연구자 참여를 요청했습니다.')
            }
        }
    }

    // insertRollback
    insertRollback = (type, e) => {
        try {
            axios.post('/api/Myproject?type=rollback', {
                is_ProjectCd : this.state.pjct_code,
                arr_MapperList : this.state.deleteMapperList
            })
            this.updateReplyCode(this.state.before_pjtcode, this.state.pjct_code)
            this.updatePostponeCode(this.state.before_pjtcode, this.state.pjct_code)
        } catch (error) {
            this.sweetalert('작업중 오류가 발생하였습니다.', error+' type : '+type, 'error', '닫기')            
        }
    }

    // 오류없이 수정완료하면 이전 project 코드 삭제
    deleteBefore = (e) => {
        axios.post('/api/Myproject?type=finish_mod', {
            is_ProjectCd : this.state.before_pjtcode,
            arr_MapperList : this.state.deleteMapperList
        })
    }

    // input value state
    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
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
        if(! $(current_target).hasClass('on')){
            $(current_target).toggleClass('on');
        }
    }
    //  연구분야 드롭다운 input 클릭시
    InputCheckBoxClicked = (code, e) => {
        this.state.ResrchFld_check = e.target.value
        this.state.ResrchFldSelect = code
        
        this.ResearchFieldMenuClicked(e)
    }

    // 날짜선택 레이어 팝업에서 날짜 선택하면 연구기간에 value값 세팅
    onCalChange = (str_date, end_date) => {
        var y_str = str_date.getFullYear().toString();
        var month = str_date.getMonth()+1
        if(month < 10) month = '0' + month
        var m_str = month.toString();
        var day = str_date.getDate()
        if(day < 10) day = '0' + day
        var d_str = day.toString();
        if(this.state.calender_flag == '1'){
            $('#startday_val').val(y_str+m_str+d_str)
        }else{
            $('#startday_val2').val(y_str+m_str+d_str)
        }
        this.state.calender_click_show = true

        if(end_date != undefined){
            var y_end = end_date.getFullYear().toString();
            var month = end_date.getMonth()+1
            if(month < 10) month = '0' + month
            var m_end = month.toString();
            var day = end_date.getDate()
            if(day < 10) day = '0' + day
            var d_end = day.toString();
            if(this.state.calender_flag == '1'){
                $('#endday_val').val(y_end+m_end+d_end)
            }else{
                $('#endday_val2').val(y_end+m_end+d_end)
            }
            $('.layer_Close').trigger('click');
            this.state.calender_click_show = false
        }
    }

    //  달력 이미지 클릭시 달력 레이어 팝업 노출
    showCalendar = (href, type, e) => {
        if(this.state.showCalendarDisable == 'Y' && type != 'delay'){
            return false;
        }
        e.preventDefault();
        if(type == 'delay'){
            this.state.calender_flag = '2'
        }else{
            this.state.calender_flag = '1'
        }

        this.state.calender_click_show = true

        var $href = href
        var el = href

        $('.picker__trigger').hide();
        $('.range-picker-input__icon').hide();            
        $('.picker-input__text').trigger('click');

        var $el = $(el);        //레이어의 id를 $el 변수에 저장
        $el.fadeIn();
        
        var $elWidth = ~~($el.outerWidth()),
            $elHeight = ~~($el.outerHeight()),
            docWidth = $(document).width(),
            docHeight = $(document).height();
            
        // 화면의 중앙에 레이어를 띄운다.
        if ($elHeight < docHeight || $elWidth < docWidth) {
            $el.css({
                marginTop: -$elHeight /2,
                marginLeft: -$elWidth/2
            })
        } else {
            $el.css({top: 0, left: 0});
        }

        $el.find('a.layer_Close').click(function(){
            $el.fadeOut();
        });

    }

    //  레이어 팝업 노출(달력 제외)
    openlayerPopup = (href, e) => {
        $(href).fadeIn();		
        $("html").css("overflow","hidden");
        $("body").css("overflow","hidden");
    }

    // 분석요소 선택시
    selectForAnalyze = (type, e) => {
        if(type == 'cencel_btn'){
            $('#pop_project9').fadeOut();
        }else{
            var count_ds = $('.tr_click').length //선택한 datasource 갯수
            var count_swt = $('.tr_click2').length //선택한 software tool 갯수
            if(count_ds ==0){
                this.sweetalert('선택된 Data source가 없습니다.', '', 'info', '닫기')
                return false;
            }
            if(count_swt ==0){
                this.sweetalert('선택된 Software tool이 없습니다.', '', 'info', '닫기')
                return false;
            }
            $('#pop_project9').fadeOut();

            let timerInterval
            Swal.fire({
              title: '프로젝트 인스터스 구동중',
              html: 'I will close in <b></b> milliseconds.',
              timer: 2000,
              onBeforeOpen: () => {
                Swal.showLoading()
                timerInterval = setInterval(() => {
                  Swal.getContent().querySelector('b')
                    .textContent = Swal.getTimerLeft()
                }, 100)
              },
              onClose: () => {
                clearInterval(timerInterval)
              }
            }).then((result) => {
              if (
                /* Read more about handling dismissals below */
                result.dismiss === Swal.DismissReason.timer
              ) {
                console.log('I was closed by the timer')
                //세션값 DB에 저장
                var cookie_userid = this.state.userid
                axios.post('/api/LoginForm?type=Session', {
                    is_Email : cookie_userid,
                    is_Token : 'sfsdafsafdsfs3e23292k3k',
                })
                .then( response => {
                    // this.sweetalertSucc('토큰 저장 완료', true)
                    //연동 사이트에 토큰값 전달
                    // window.open('http://127.0.0.1:6956','win0','location=no, width=1024,height=768,status=no,toolbar=no,scrollbars=no')
                    axios.get('/api/cmpathinfo')
                    .then(response => {
                        var url = response.data.home_url+'/MyProject_sitepop/'+this.state.before_pjtcode+'/'+this.state.swt_code;
                        window.location.href = url;
                    })
                })
                .catch( response => { return false;} );
              }
            })


        }
        $("html").css("overflow","visible");
        $("body").css("overflow","visible");
    } 

    // 프로젝트 분석하기 팝업 영역 마우스 hover 이벤트
    InfoHover (type, e) {

        let current_target = e.target;
        $(current_target).parent('tr').addClass('tr_select');

        this.setState({ analysis_DataSrceInfo: this.DataSrceInfoAppend2('anly') });
        this.setState({ analysis_SWtoolInfo: this.SWtoolInfoAppend2('anly') });
    }
    
    // 프로젝트 분석하기 팝업 영역 마우스 Leave 이벤트
    InfoLeave (type, e) {

        let current_target = e.target;
        $(current_target).parent('tr').removeClass('tr_select');
        
        this.setState({ analysis_DataSrceInfo: this.DataSrceInfoAppend2('anly') });
        this.setState({ analysis_SWtoolInfo: this.SWtoolInfoAppend2('anly') });
    }

    // 프로젝트 분석하기 팝업 영역 마우스  Click 이벤트
    infoClick (type, e) {
        let current_target = e.target;
        $('tr').removeClass('tr_select');
        $('tr').removeClass('tr_click');
        $(current_target).parents('tr').addClass('tr_click');
    }

    // 프로젝트 분석하기 팝업 영역 마우스  Click 이벤트
    infoClick2 (e) {
        let current_target = e.target;
        $('tr').removeClass('tr_select');
        $('tr').removeClass('tr_click2');
        $(current_target).parents('tr').addClass('tr_click2');
        this.state.swt_code = current_target.getAttribute('swt_code')
    }

    //공동연구자 개인 수정
    ptcipantSlctDelete = (email, name, e) => {
        this.sweetalertDelete('정말 삭제하시겠습니까?', function() {
            var mail = email.replace('@','').replace('.','')
            var ptc_val = $('#Ptcipantemail_val').val()
            ptc_val = ptc_val.replace(mail, '')
            $('#Ptcipantemail_val').val(ptc_val)

            $('#'+email).remove()
            $('.'+email).remove()
        })
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
                this.RfChecktrigger()
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
            this.temp_id = 'resrcfield_val_'
            this.temp_id = this.temp_id + this.state.responseSubCode.json[i].code_cd;
            if(this.state.pjt_field_cd == this.state.responseSubCode.json[i].code_cd){
                var temp_classname =  'rsc_field_a on'
                this.state.ResrchFld_check = this.state.pjt_field_cd
                this.state.ResrchFldSelect = this.state.responseSubCode.json[i].code_nm
            }else{
                var temp_classname =  'rsc_field_a'
            }

            result.push(
                <li>
                    <label className={temp_classname} htmlFor={this.temp_id} onClick={this.ReseachFieldCheckBoxClicked}>{this.state.responseSubCode.json[i].code_nm}</label>
                    <span>
                        <input type="checkbox" className="checkbox" id={this.temp_id} name="is_Resrch_field_tmp" onClick={(e) => this.InputCheckBoxClicked(this.state.responseSubCode.json[i].code_nm, e)} value={this.state.responseSubCode.json[i].code_cd} />
                    </span>
                </li>
            )
        }
        return result
    }

    //연구분야 리스트 초기값 체크되도록 처리
    RfChecktrigger = () => {
        for(let i=0; i<this.state.responseSubCode.json.length; i++){
            const idx = (i+1)+"";
            var temp_id = 'resrcfield_val_'
            temp_id = temp_id + this.state.responseSubCode.json[i].code_cd;

            if(this.state.pjt_field_cd == this.state.responseSubCode.json[i].code_cd){
                $('#'+temp_id).prop('checked', true)
            }
        }
    }

    // 연구자 리스트 호출
    callRsrcherListApi = async (e) => {
        try {
            axios.post('/api/Myproject?type=resrcher', {
                is_ResrcherName : $('#resrcherName').val(),
                is_UserEmail : this.state.userid
            })
            .then( response => {
                try {
                    this.setState({ responseResearcherList: response });
                    this.setState({ append_ResearcherList: this.ResearcherListAppend() });
                } catch (error) {
                    this.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기')
                }
            })
            .catch( response => {return false;} );
        } catch (error) {
            this.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기')            
        }
    }

    // 연구자 리스트 append
    ResearcherListAppend = () => {
        try {
            let result = []
            var Researcherlist = this.state.responseResearcherList.data
            const size = Researcherlist.json.length
            for(let i=0; i<size; i++){
                this.state.one_paticipant_username = Researcherlist.json[i].resrcher_username
                this.state.one_paticipant_email = Researcherlist.json[i].resrcher_email

                result.push(
                    <tr onClick={(e) => this.selectResearcher(Researcherlist.json[i].resrcher_email, Researcherlist.json[i].resrcher_username, 'oneclick', e)}>
                        <td>{Researcherlist.json[i].resrcher_username}</td>
                        <td>{Researcherlist.json[i].resrcher_userorg}</td>
                        <td>{Researcherlist.json[i].resrcher_usermajor}</td>
                        <td>{Researcherlist.json[i].resrcher_email}</td>
                    </tr>
                )
            }
            if(size == 0){
                this.sweetalert('검색결과가 없습니다.', '', 'info', '닫기')
            }

            return result
        } catch (error) {
            this.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기')
        }
    }

    // 공동연구자 선택시
    selectResearcher = (useremail, username, flag, e) => {

        //검색된 연구자 리스트 크기
        var size = $('.pop_project5').find('.table_ty8').find('tr').length-1
        //공동연구자 input에 text append
        if(username == ''){
            username =  this.state.one_paticipant_username
            useremail =  this.state.one_paticipant_email
        }
        var Ptcipantemail_val = $('#Ptcipantemail_val').val()
        var useremail2 = useremail.replace('@','').replace('.','')

        if(flag =='cencel_btn'){   
            //취소버튼일경우
        }else if(size ==0){
            this.sweetalert('조회하신 성명이 존재하지 않습니다.', '', 'info', '닫기')
            return
        }else if(Ptcipantemail_val.indexOf(useremail2) > -1){
            this.sweetalert('이미 추가된 연구자입니다.', '', 'info', '닫기')
            return
        }else if(Ptcipantemail_val == ''){
            Ptcipantemail_val += useremail2
        }else{
            Ptcipantemail_val += ','+useremail2
        }
        $("html").css("overflow","visible");
        $("body").css("overflow","visible");
        
        //조건별 메시지 alert        
        if(flag =='cencel_btn'){
            $('#pop_project5').fadeOut()
        }else if((size == 1) || flag == 'oneclick'){
            this.sweetalertSucc('공동연구자 신청이 완료되었습니다', true)
            $('#Ptcipantemail_val').val(Ptcipantemail_val)
            this.setState({ append_pctAddList: this.pctAddListAppend(username, useremail, '')})
            $('#pop_project5').fadeOut()

            var useremail2 = useremail.replace('@','').replace('.','')

            $('#ptcipant_append').append('<input id="arr_ptcipantEmail" type="hidden" name="arr_ptcipantEmail" class ='+useremail2+' value="'+useremail+'"/>')
            $('#ptcipant_append').append('<input id="arr_ptcipantName" type="hidden" name="arr_ptcipantName" class ='+useremail2+' value="'+username+'"/>')
            $('#ptcipant_append').append('<input id="arr_ptcipantflag" type="hidden" name="arr_ptcipantflag" class ='+useremail2+' value="/W"/>')
        }else if(size > 1){
            this.sweetalert('검색된 연구자가 2명 이상입니다. \n연구자 성명을 클릭해주세요.', '', 'info', '닫기')
        }else if(size == 0){
            this.sweetalert('신청된 연구자가 없습니다.', '', 'info', '닫기')
            $('#pop_project5').fadeOut()
        }
    }

    // 연구자 추가정보 리스트 append
    pctAddListAppend = (username, useremail, flag) => {
        try {
            var useremail2 = useremail.replace('@','').replace('.','')

            if(flag == '(승인)'){
                flag = <span1>(승인)</span1>
            }else if(flag == '(반려)'){
                flag = <span2>(반려)</span2>
            }

            this.state.pctAddresult.push(
            <tr className="in32" id={useremail2}>
                <th className="">{username}{flag}</th>
                <td>
                    {useremail} <a href="#n" className="c_del c_del_a" onClick={(e) => this.ptcipantSlctDelete(useremail2, username, e)} ></a>
                </td>
            </tr>
            )
            return this.state.pctAddresult
        } catch (error) {
            this.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기')
        }
    }

    // datasource 리스트 호출
    callDataSrceListApi = async () => {
        try {
            const response = await fetch('/api/Myproject?type=datasrce', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({}),
            });
            
            const body = await response.json();
            this.setState({ responseDataSrceList: body });
            this.setState({ append_DataSrceList: this.DataSrceListAppend() });
            //사용 datasource 리스트가 layer팝업안안에서 체크되도록 처리
            setTimeout(function() {
                this.dsChecktrigger()
                }.bind(this),1
            );
        } catch (error) {
            this.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기')            
        }
    };

    // datasource 리스트 append
    DataSrceListAppend = () => {
        try {
            let result = []

            const size = this.state.responseDataSrceList.json.length;

            var date = this.state.responseDataSrceList.json[0].ds_start_date
            var year = date.substr(0,4)
            var month = date.substr(4,2)
            var day = date.substr(6,2)
            var ds_start_date = year +'.'+month+'.'+day

            date = this.state.responseDataSrceList.json[0].ds_end_date
            year = date.substr(0,4)
            month = date.substr(4,2)
            day = date.substr(6,2)
            var ds_end_date = year +'.'+month+'.'+day

            this.state.select_DataSrce_size = size

            for(let i=0; i<size; i++){
                
                const idx = (i+1)+"";
                var temp_name = 'is_Datasrc'
                temp_name = temp_name + idx;
                var temp_id = 'datasrc_val'
                temp_id = temp_id + idx;
                
                result.push(
                    <tr>
                        <td className="check_ty2">
                            <input id={temp_id} type="checkbox" name={temp_name}/>
                            <label for={temp_id}></label>
                        </td>
                        <td>{this.state.responseDataSrceList.json[i].ds_dbname}</td>
                        <td>{this.state.responseDataSrceList.json[i].ds_holdorg}</td>
                        <td>
                            <p>{ds_start_date}</p>
                            <p>{ds_end_date}</p>
                        </td>
                        <td>{this.state.responseDataSrceList.json[i].ds_typenm}</td>
                    </tr>
                )
            }
            return result
        } catch (error) {
            this.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기')
        }
    }

    //사용 datasource 리스트가 layer팝업안에서 체크되도록 처리
    dsChecktrigger = () => {
        const size = this.state.responseDataSrceList.json.length;
        for(let i=0; i<size; i++){
            const idx = (i+1)+"";
            var temp_id = 'datasrc_val'
            temp_id = temp_id + idx;
            var code = this.state.responseDataSrceList.json[i].ds_code
            if(this.state.DataSourceModiList.indexOf(code) >-1){
                $('#'+temp_id).prop('checked', true)
            }
            if(this.state.DataSourceModiAcceptList.indexOf(code) >-1){
                $('#'+temp_id).parent().parent('tr').remove()
            }
        }
    }

    // DataSource 선택시
    selectDataSource = (type, e) => {
        if(type == 'cencel_btn'){
            $('#pop_project4').fadeOut();
        }else{
            this.setState({ append_selectDataSrceList: this.SelectDtSrceAppend() });
            $('#pop_project4').fadeOut();
        }
        $("html").css("overflow","visible");
        $("body").css("overflow","visible");
    }    

    // 프로젝트 상세 DataSource 정보 append
    SelectDtSrceAppend = () => {
        try {
            let result = []
            var size = this.state.select_DataSrce_size
            var flag = false
            for(let i=0; i<size; i++){

                var imgpath = this.state.responseDataSrceList.json[i].ds_imagepath
                var dbname = this.state.responseDataSrceList.json[i].ds_dbname
                var holdorg = this.state.responseDataSrceList.json[i].ds_holdorg
                var type = this.state.responseDataSrceList.json[i].ds_typenm
                var dscode = this.state.responseDataSrceList.json[i].ds_code

                imgpath = '/image/'+imgpath

                if($('#datasrc_val'+(i+1)).is(":checked") && this.state.DataSourceWaitAcceptList.indexOf(dscode) == -1){
                    flag =  true
                    result.push(
                        <tr>
                            <th><img src={imgpath} alt=""/></th>
                            <td>{dbname} ({holdorg} / {type})</td>
                            <input id="arr_Ds_code" type="hidden" name="arr_Ds_code" value={this.state.responseDataSrceList.json[i].ds_code} />
                            <input id="arr_Ds_name" type="hidden" name="arr_Ds_name" value={this.state.responseDataSrceList.json[i].ds_dbname} />
                            <input id="arr_Ds_flag" type="hidden" name="arr_Ds_flag" value="/W" />
                        </tr>
                    )
                }else if(($('#datasrc_val'+(i+1)).is(":checked") && this.state.DataSourceWaitAcceptList.indexOf(dscode) > -1)|| this.state.DataSourceModiAcceptList.indexOf(dscode) > -1){
                }else{
                    $('#'+dscode).remove()
                    this.state.DataSourceWaitAcceptList = this.state.DataSourceWaitAcceptList.replace(dscode, '')
                }
            }
            if(!flag && $('#appendSrceList').text() == ''){
                $('#empty_ds').show()
            }else{
                $('#empty_ds').hide()
            }

            return result
        } catch (error) {
            this.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기')
        }
    }

    // softwareTool 리스트 호출
    callSWtoolListApi = async () => {
        try {
            const response = await fetch('/api/Myproject?type=swtool', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({}),
            });
            
            const body = await response.json();
            this.setState({ responseSWtooleList: body });
            this.setState({ append_SWtoolList: this.SWtoolListAppend() });
            //사용 softwareTool 리스트가 layer팝업안안에서 체크되도록 처리
            setTimeout(function() {
                this.swChecktrigger()
                }.bind(this),1
            );
        } catch (error) {
            this.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기')            
        }
    };

    // softwareTool 리스트 append
    SWtoolListAppend = () => {
        try {
            let result = []

            const size = this.state.responseSWtooleList.json.length;
            this.state.select_SWtool_size = size
            for(let i=0; i<size; i++){
                
                const idx = (i+1)+"";
                var temp_name = 'is_Swtool'
                temp_name = temp_name + idx;
                var temp_id = 'swtool_val'
                temp_id = temp_id + idx;

                result.push(
                    <tr>
                        <td className="check_ty2">
                            <input id={temp_id} type="checkbox" name={temp_name}/>
                            <label for={temp_id}></label>
                        </td>
                        <td>{this.state.responseSWtooleList.json[i].swt_toolname}</td>
                        <td>{this.state.responseSWtooleList.json[i].swt_comments}</td>
                    </tr>
                )
            }

            return result
        } catch (error) {
            this.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기')
        }
    }

    //사용 SwTool 리스트가 layer팝업안에서 체크되도록 처리
    swChecktrigger = () => {
        const size = this.state.responseSWtooleList.json.length;
        for(let i=0; i<size; i++){
            const idx = (i+1)+"";
            var temp_id = 'swtool_val'
            temp_id = temp_id + idx;
            var code = this.state.responseSWtooleList.json[i].swt_code
            if(this.state.SwToolModiList.indexOf(code) >-1){
                $('#'+temp_id).prop('checked', true)
            }
            if(this.state.SwToolModiAcceptList.indexOf(code) >-1){
                $('#'+temp_id).parent().parent('tr').remove()
            }
        }
    }

    // softwareTool 선택시
    selectSWtood = (type, e) => {
        if(type == 'cencel_btn'){
            $('#pop_project6').fadeOut();
        }else{
            this.setState({ append_SWtoolIList: this.SelectSWtoolAppend() });
            $('#pop_project6').fadeOut();
        }
        $("html").css("overflow","visible");
        $("body").css("overflow","visible");
    }    

    // 프로젝트 상세 softwareTool 정보 append
    SelectSWtoolAppend = () => {
        try {
            let result = []
            var flag = false

            for(let i=0; i<this.state.select_SWtool_size; i++){
                var swtoodname = this.state.responseSWtooleList.json[i].swt_toolname
                var imgpath = this.state.responseSWtooleList.json[i].swt_imagepath
                var swtcode = this.state.responseSWtooleList.json[i].swt_code

                imgpath = '/image/'+imgpath

                if($('#swtool_val'+(i+1)).is(":checked") && this.state.SwToolWaitAcceptList.indexOf(swtcode) == -1){
                    flag = true
                    result.push(
                        <tr>
                            <th><img src={imgpath} alt=""/></th>
                            <td>{swtoodname}</td>
                            <input id="arr_Swt_code" type="hidden" name="arr_Swt_code" value={this.state.responseSWtooleList.json[i].swt_code} />
                            <input id="arr_Swt_name" type="hidden" name="arr_Swt_name" value={this.state.responseSWtooleList.json[i].swt_toolname} />
                            <input id="arr_Swt_flag" type="hidden" name="arr_Swt_flag" value='/W' />
                        </tr>
                    )
                }else if(($('#swtool_val'+(i+1)).is(":checked") && this.state.SwToolWaitAcceptList.indexOf(swtcode) > -1) || this.state.SwToolModiAcceptList.indexOf(swtcode) > -1){
                }else{
                    $('#'+swtcode).remove()
                    this.state.SwToolWaitAcceptList = this.state.SwToolWaitAcceptList.replace(swtcode, '')
                }
            }
            if(!flag && $('#appendSWToolList').text() == ''){
                $('#empty_swt').show()
            }else{
                $('#empty_swt').hide()
            }
            return result
        } catch (error) {
            this.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기')
        }
    }

    // 레이어 팝업 엔터 summit
    handleSubmit = (e) => {
      e.preventDefault()
      this.callRsrcherListApi(e)
    }

    // 연구파일 추가
    appendfileform = (e) => {
        this.setState({ append_fileform : this.append_form()});
    }

    // 연구파일 form append
    append_form = (e) => {
        $('#empty_file').hide()
        this.state.file_idx += 1

        var file_id = 'file_' + this.state.file_idx
        var file_id2 = 'file_' + this.state.file_idx+'2'
        this.state.file_result.push(
            <tr className={file_id}>
                <th>파일첨부{this.state.file_idx}</th>
                <td className="fileBox fileBox1">
                    <label htmlFor={this.state.file_idx} className="btn_file">파일선택</label>
                    <input type="text" id={file_id2} className="fileName fileName1" readOnly="readonly" placeholder="선택된 파일 없음"/>
                    <input type="file" id={this.state.file_idx} className="uploadBtn uploadBtn1" onChange={e => this.handleFileInput(e)}/>
                    <a href="#n" id ={file_id} onClick={(e) => this.fileDelete('new', e)} className="c_del"></a>
                </td>
            </tr>
        )
        return this.state.file_result
    }
    
    //업로드할 파일 세팅
    handleFileInput(e){
        var id = e.target.id
        $('#file_'+e.target.id+'2').val(e.target.files[0].name)
        this.setState({
          selectedFile : e.target.files[0],
        })

        setTimeout(function() {
            this.handlePost(id ,e)
        }.bind(this),1
        );
    }

    //파일 업로드
    handlePost(id, e){
        const formData = new FormData();
        formData.append('file', this.state.selectedFile);
        var classname = 'file_' +id
    
        return axios.post("/api/upload?type=uploads", formData).then(res => {
            try {
                $('#file_append2').append('<input id="'+res.data.filename+'" type="hidden" className="'+classname+'" name="arr_filename" value="'+res.data.filename+'"/>')
                $('#file_append2').append('<input id="" type="hidden" className="" name="arr_reg_user" value=""/>')
                $('#file_append2').append('<input id="" type="hidden" className="" name="arr_reg_date" value=""/>')
            } catch (error) {
                this.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기')
            }
        }).catch(err => {
            this.sweetalert('작업중 오류가 발생하였습니다.', err, 'error', '닫기')
        })
    }

    // 연구기간 연장 신청시
    delayRerchfinal = (type, e) => {

        if(type == 'cencel_btn'){
            $('#pop_project1').fadeOut();
        }else{
            this.insertPostponePeriod()
            $('#pop_project1').fadeOut();
        }
        $("html").css("overflow","visible");
        $("body").css("overflow","visible");
    }    

    //연장 연구기간 저장
    insertPostponePeriod = (e) => {

        var is_Startday = $('#startday_val2').val()
        var is_Endday = $('#endday_val2').val()
        var cookie_userid = this.state.userid
        // 수정일경우 연구기간 삭제
        axios.post('/api/Myproject?type=PostponeDelete', {
            is_Pjt_code : this.state.before_pjtcode,
        })
        setTimeout(function() {
            axios.post('/api/Myproject?type=PostponeSave', {
                is_Pjt_code : this.state.before_pjtcode,
                is_Startday : is_Startday,
                is_Endday : is_Endday,
                is_Email : cookie_userid,
            })
            .then( response => {
                this.updatePjtstatus()
                //관리자에게 연장 요청 메시지 전송
                var cookie_username = this.state.usernm
                this.sendNoticeMessage('admin', cookie_username+'님이 '+this.state.pjt_name+'프로젝트 연구기간을 연장신청했습니다.', '')
                this.sendEmailtoAdmin('admin', 'rtrod 연구기간 연장 요청', cookie_username+'님이 '+this.state.pjt_name+'프로젝트 연구기간을 연장신청했습니다.')
                this.saveLogMessage('LG5','연구기간을 연장 신청했습니다. 연장기간 : '+is_Startday+'~'+is_Endday+' 프로젝트 명 :'+this.state.pjt_name)
            })
            .catch( response => { return false;} );
        }.bind(this),1000
        );

        // 연구기간 저장
    }

    //알림 메시지 전송
    sendNoticeMessage = (receiver, message, notice_code, e) => {
        axios.post('/api/message?type=push', {
            is_Receiver : receiver,
            is_Message : message,
            is_Notice_code : notice_code,
            is_Pjtcode : this.state.pjct_code,
        })
        .then( response => {
        })
        .catch( response => {this.sweetalert('작업중 오류가 발생하였습니다.', response, 'error', '닫기')} ); 
    }

    //로그 저장
    saveLogMessage = (log_cd, log_contents) => {
        axios.post('/api/system?type=log', {
            is_Log_cd : log_cd,
            is_Log_contents : log_contents,
            is_Reg_usernm : this.state.usernm,
            is_Reg_user : this.state.userid,
        })
        .then( response => {
        })
        .catch( response => {this.sweetalert('작업중 오류가 발생하였습니다.', response, 'error', '닫기')} ); 
    }

    //관리자에게 연구기간 연장 메일 발송
    sendEmailtoAdmin = (email, subject, text, e) => {

        //관리자 리스트 호출
        axios.post('/api/LoginForm?type=adminlist', {
        })
        .then( response => {
            for(var i=0; i< response.data.json.length; i++){
                var useremail = response.data.json[i].useremail
                if(useremail != 'admin'){
                    axios.post('/api/message?type=email&roll=basic', {
                        is_Email : useremail,
                        is_Subject : subject,
                        is_Text: text
                    })
                    .then( response => {
                    })
                    .catch( response => {this.sweetalert('작업중 오류가 발생하였습니다.', response, 'error', '닫기'); return false;});
                }
            }
        })
        .catch( response => {this.sweetalert('작업중 오류가 발생하였습니다.', response, 'error', '닫기'); return false;});
    }

    //공동연구자에게 메일발송
    sendEmail = (email, subject, text, e) => {
        axios.post('/api/message?type=email&roll=basic', {
            is_Email : email,
            is_Subject : subject,
            is_Text: text
        })
        .then( response => {
        })
        .catch( response => {this.sweetalert('작업중 오류가 발생하였습니다.', response, 'error', '닫기'); return false;});
    }

    // 프로젝트 상태 변경(진행) > 연장요청)
    updatePjtstatus = (e) => {
        axios.post('/api/Myproject?type=updatePjtStatus', {
            is_Pjt_code : this.state.before_pjtcode,
            is_Pjt_status : 'RS4',
        })
        .then( response => {
            this.sweetalertSucc('프로젝트 상태가 \'연장요청\'으로 변경되었습니다.', true)

            this.state.pjt_status = 'RS4'
            this.callResrchInfoApi(this.state.before_pjtcode)
            this.callPostponePeriodApi(this.state.before_pjtcode)
        })
        .catch( response => {this.sweetalert('작업중 오류가 발생하였습니다.', response, 'error', '닫기'); return false;});
    }

    //화면 클릭이벤트 감지
    clickdetect = (e) => {
        if(this.state.calender_click_show){
            this.state.calender_click_show = false
        }else{
            if(e.target.id != 'left-arrow' && e.target.id != 'right-arrow' && e.target.className != 'calendar__head--title'){
                $('.layer_Close').trigger('click');
                this.state.calender_click_show = true
            }
        }
    } 

    render () {
        return (
            <section className="sub_wrap" onClick={(e) => this.clickdetect(e)}>
                <article className="s_cnt mp_pro_li ct1">
                    <div className="li_top">
                        <h2 className="s_tit1">project 신청</h2>
                        <div class="pv_bt af">
                         <a href="javascript:" class="bt_ty6" onClick={(e) => this.openlayerPopup('.pop_project9', e)}>프로젝트 분석하기</a>
                        </div>
                    </div>
                    <div className="pv_cont">
                    <form method="post" name="frm" action="">
                        <input id="is_Email" type="hidden" name="is_Email" value={this.state.userid} />
                        <input id="is_ProjectCd" type="hidden" name="is_ProjectCd" />
                        <input id="is_Resrch_field" type="hidden" name="is_Resrch_field" value={this.state.ResrchFld_check}/>
                        <input id="is_Pjt_status" type="hidden" name="is_Pjt_status" value={this.state.pjt_status}/>
                        <input id="Ptcipantemail_val" type="hidden" name="Ptcipantemail_val" />
                        <input id="is_Regdate" type="hidden" name="is_Regdate" value={this.state.reg_date} />
                        

                        <div className="pv_top">
                            <div className="lbx">
                                <h4 className="title_ty1">연구정보</h4>
                                <table className="table_ty3 table_ty3_2">
                                    <tbody>
                                        <tr>
                                            <th>연구명</th>
                                            <td><input id="pjtname_val" type="text" name="is_Pjtname"/></td>
                                        </tr>
                                        <tr>
                                            <th>책임연구자</th>
                                            <td>{this.state.usernm}</td>
                                            <input type="hidden" id="owner_val" name="is_Owner" value={this.state.usernm} />
                                        </tr>
                                        <tr>
                                            <th>구분</th>
                                            <td>
                                            {/* <!-- 인풋 네임 변경가능 --> */}
                                            <ul className="check_ty1">
                                                <li><input id="type_val" type="radio" name="is_Type" id="check1" value="public" /><label htmlFor="check1">public</label></li>
                                                <li><input id="type_val" type="radio" name="is_Type" id="check2" value="private" /><label htmlFor="check2">private</label></li>
                                                <input type="hidden" id="is_TypeCheck" name="is_TypeCheck"/>
                                            </ul>
                                        </td>
                                        </tr>
                                        <tr>
                                            <th>연구기간</th>
                                            <td className="cal_box">
                                                <input  id="startday_val" type="text" name="is_Startday" readOnly/>
                                                <label className="cal_i" htmlFor="" onClick={(e) => this.showCalendar('#layer_pop', 'first', e)} ><img src={require("../../img/sub/cal_i.png")} alt=""/> ~</label>
                                                <input  id="endday_val" type="text" name="is_Endday" readOnly/>
                                                <label className="cal_i" htmlFor="" onClick={(e) => this.showCalendar('#layer_pop', 'first',e)}><img src={require("../../img/sub/cal_i.png")} alt=""/></label>
                                                <a href="#n" className="bt_c1 elong" onClick={(e) => this.openlayerPopup('#pop_project1', e)}>기간연장</a>
                                            </td>
                                        </tr>
                                        <tr id='postpone'  style={{display:'none'}}>
                                            <th>연장 연구기간</th>
                                            <td id='postpone_prepend'>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>연구분야</th>
                                            <td>
                                                <div className="sch_ty1">
                                                    <h3 onClick={this.ResearchFieldMenuClicked}>{this.state.ResrchFldSelect}</h3>
                                                    <ul className="schb_ty1">
                                                        {this.state.append_ResrchFld}
                                                    </ul>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th className="last_th">연구내용</th>
                                            <td><textarea id="resrch_contents" name="is_Resrch_contents"></textarea></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div className="rbx">
                                <h4 className="title_ty1">사용 Data source
                                    <a href="#n" className="f_more data_bt" onClick={(e) => this.openlayerPopup('#pop_project4', e)}></a>
                                </h4>
                                <div className="t_wrap">
                                    <table className="table_ty3 table_ty4">
                                        <tr id="empty_ds">
                                            <th></th>
                                            <td>추가 하시려면, 오른쪽 상단의&nbsp;[<img src={require("../../img/sub/f_more.png")} alt=""/>]&nbsp;버튼을 눌러주세요</td>
                                        </tr>
                                        <tbody id="appendSrceList">
                                        </tbody>
                                        <tbody id="appendSrceList2">
                                            {this.state.append_selectDataSrceList}
                                        </tbody>
                                    </table>
                                </div>

                                <h4 className="title_ty1 mt40">사용 Sotfware tool
                                    <a href="#n" className="f_more sw_bt" onClick={(e) => this.openlayerPopup('#pop_project6', e)}></a>
                                </h4>
                                <div className="t_wrap t_wrap2">
                                    <table className="table_ty3 table_ty4 table_ty5">
                                    <tr id="empty_swt">
                                            <th></th>
                                            <td>추가 하시려면, 오른쪽 상단의&nbsp;[<img src={require("../../img/sub/f_more.png")} alt=""/>]&nbsp;버튼을 눌러주세요</td>
                                        </tr>
                                        <tbody id="appendSWToolList">
                                        </tbody>
                                        <tbody id="appendSWToolList2">
                                            {this.state.append_SWtoolIList}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        <div className="pv_middle mt40">
                            <div className="lbx">
                            <h4 className="title_ty1">연구자 정보</h4>
                                <table className="table_ty3 table_ty6">
                                    <tbody>
                                        <tr className="in32" id="ptcipant_append">
                                            <th className="last_th">공동연구자</th>
                                            <td>
                                                {/* <input id="Ptcipant_val" type="hidden" name="is_PtcipantName" readOnly onChange={this.handleChange} /> */}
                                                <a href="#n" className="c_del c_plu" onClick={(e) => this.openlayerPopup('#pop_project5', e)} >추가</a>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div className="lbx t_wrap4">
                                    <table className="table_ty32 table_ty66">
                                    <tbody>
                                        {this.state.append_pctAddList}
                                    </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="rbx">
                                <h4 className="title_ty1">연구파일
                                    <a href="javascript::" className="f_more" onClick={(e) => this.appendfileform(e)}></a>
                                </h4>
                                <div className="t_wrap t_wrap3">
                                    <table className="table_ty3 table_ty6 table_ty7">
                                    <tr id="empty_file">
                                            <th>파일첨부</th>
                                            <td>추가 하시려면, 오른쪽 상단의&nbsp;[<img src={require("../../img/sub/f_more.png")} alt=""/>]&nbsp;버튼을 눌러주세요</td>
                                        </tr>
                                        <tbody id='file_append0'>
                                        </tbody>
                                        <tbody id='file_append1'>
                                            {this.state.append_UploadfileInfo}
                                        </tbody>
                                        <tbody id='file_append2'>
                                            {this.state.append_fileform}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div className="pv_bottom">
                            <h4 className="title_ty1">연구 토론</h4>
                            <div className="pvb_write">
                                <textarea id= "reply_val" name="is_ReplyContents" rows="" cols="" placeholder="글을 입력해주세요."></textarea>
                                <a href="javascript:" className="submit" onClick={(e) => this.submitReplyClick('save_reply', e)} >등록하기</a>
                            </div>
                            <div className="pvb_cont">
                                <div className="table_cont">
                                    <ul>
                                        {this.state.append_ReplyList}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </form>
                        <div className="btn_confirm mt20">
                            <Link to={'/'} className="bt_ty bt_ty1 cancel_ty1">목록</Link>
                            <a href="javascript:" className="bt_ty bt_ty1 cancel_ty2" onClick={(e) => this.CencelClick(e)}>취소</a> 
                            <a href="javascript:" className="bt_ty bt_ty2 submit_ty1" onClick={(e) => this.submitClick('save', e)}>저장</a> 
                        </div>

                        {/* 날짜선택 레이어 팝업 */}  
                        <div id="layer_pop" className="pop-layer" style={{zIndex:2}}>
                            <div className="pop-container">
                                <div className="pop-conts">
                                    <div style={{ height: "347px", width:"600px" }}>
                                        <RangeDatePicker
                                            onChange = {this.onCalChange}
                                         />
                                    </div>
                                    <div className="btn-r">
                                        <a href="" className="layer_Close">Close</a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pop_project pop_project1"  id="pop_project1" style={{zIndex:1}}>
                            <h2 className="p_title">연구기간 연장</h2>
                            <form name="" id="" action="post">
                                <div className="pj_wrap">
                                    <ul>
                                        <li><span className="pj_th">연구명</span>{this.state.pjt_name}</li>
                                        <li><span className="pj_th">이전 연구기간</span>{this.state.pjt_period}</li>
                                        <li className="cal_box">
                                            <span className="pj_th">새 연구기간</span>
                                            <input  id="startday_val2" type="text" name="is_Startday2" readOnly/>
                                            <label className="cal_i" htmlFor="p_cal1" onClick={(e) => this.showCalendar('#layer_pop', 'delay',e)}><img src={require("../../img/sub/cal_i.png")} alt=""/> ~</label>
                                            <input  id="endday_val2" type="text" name="is_Endday2" readOnly/>
                                            <label className="cal_i" htmlFor="p_cal2" onClick={(e) => this.showCalendar('#layer_pop', 'delay',e)}><img src={require("../../img/sub/cal_i.png")} alt=""/></label>
                                        </li>
                                    </ul>
                                </div>
                                <div className="p_btn_box">
                                    <a href="#n" className="p_btn p_btn1 cencel_bt" onClick={(e) => this.delayRerchfinal('cencel_btn', e)} >취소</a>
                                    <a href="#n" className="p_btn p_btn2" onClick={(e) => this.delayRerchfinal('save', e)}>신청</a>
                                </div>
                            </form>
                        </div>

                        {/* Data Source 추가 레이어 팝업 */}
                        <div className="pop_project pop_project4"  id="pop_project4" >
                            <h2 className="p_title">Data Source 선택</h2>
                            <form name="dataSourceList" id="dataSourceList" action="post">
                                <div className="pj_wrap">
                                    <div className="pj_t_wrap">
                                        <table className="table_ty8">
                                            <tr>
                                                <th>사용여부</th>
                                                <th>DB명</th>
                                                <th>보유기관</th>
                                                <th>데이터기간</th>
                                                <th>구분</th>
                                            </tr>
                                            {this.state.append_DataSrceList}
                                        </table>
                                    </div>
                                </div>
                                <div className="p_btn_box">
                                    <a href="javascript:" className="p_btn p_btn1 cencel_bt" onClick={(e) => this.selectDataSource('cencel_btn', e)} >취소</a>
                                    <a href="javascript:" className="p_btn p_btn2" onClick={(e) => this.selectDataSource('', e)}>신청</a>
                                </div>
                            </form>
                        </div>

                        {/* 공동연구자 추가 레이어 팝업 */}
                        <div className="pop_project pop_project5" id="pop_project5">
                            <h2 className="p_title">공동연구자 추가</h2>
                            <form onSubmit={this.handleSubmit}>
                                <div className="pj_wrap">
                                    <div className="pj_t_wrap">
                                        <div className="pop_sch">
                                            <label for="resrcherName">성명</label>
                                            <input type="text" id="resrcherName" name="is_ResrcherName" placeholder="이름을 입력해주세요." />
                                            <a className="bt_c1 sch_bt3"href="#n" onClick={(e) => this.callRsrcherListApi(e)}>조회</a>
                                        </div>
                                        <table className="table_ty8">
                                            <tr>
                                                <th width='15%'>성명</th>
                                                <th width='15%'>소속</th>
                                                <th width='25%'>전공</th>
                                                <th width='45%'>이메일</th>
                                            </tr>
                                            {this.state.append_ResearcherList}
                                        </table>
                                    </div>
                                </div>
                                <div className="p_btn_box">
                                    <a href="javascript:" className="p_btn p_btn1 cencel_bt" onClick={(e) => this.selectResearcher('', '','cencel_btn', e)}>취소</a>
                                    <a href="javascript:" className="p_btn p_btn2" onClick={(e) => this.selectResearcher('', '', '',e)}>신청</a>
                                </div>
                            </form>
                        </div>

                        {/* SoftWare Tool 추가 레이어 팝업 */}
                        <div className="pop_project pop_project6" id="pop_project6">
                            <h2 className="p_title">Software Tool 선택</h2>
                            <form name="" id="" action="post">
                                <div className="pj_wrap">
                                    <div className="pj_t_wrap">
                                        <table className="table_ty8">
                                            <tr>
                                                <th width='10%'>사용여부</th>
                                                <th width='15%'>Tool명</th>
                                                <th width='75%'>기능</th>
                                            </tr>
                                            {this.state.append_SWtoolList}
                                        </table>
                                    </div>
                                </div>
                                <div className="p_btn_box">
                                    <a href="#n" className="p_btn p_btn1 cencel_bt" onClick={(e) => this.selectSWtood('cencel_btn', e)}>취소</a>
                                    <a href="#n" className="p_btn p_btn2" onClick={(e) => this.selectSWtood('', e)}>신청</a>
                                </div>
                            </form>
                        </div>

                        {/* Data Source 추가 레이어 팝업 */}
                        <div className="pop_project pop_project9"  id="pop_project9" >
                            <h2 className="p_title">프로젝트 분석하기</h2>
                            <form name="dataSourceList" id="dataSourceList" action="post">
                                <div className="pj_wrap">
                                    <div className="pj_t_wrap">
                                            <div className="rbx">
                                                <h4 className="title_ty1">사용 Data source</h4>
                                                <div className="t_wrap">
                                                    <table className="table_ty3 table_ty4">
                                                        <tbody>
                                                        {
                                                        (this.state.analysis_DataSrceInfo == '') ?
                                                        <span3>승인된 Datasource가 없습니다.</span3> :
                                                        this.state.analysis_DataSrceInfo
                                                        }
                                                        </tbody>
                                                    </table>
                                                </div>
                                                <h4 className="title_ty1 mt40">사용 Sotfware tool</h4>
                                                <div className="t_wrap t_wrap2">
                                                    <table className="table_ty3 table_ty4 table_ty5">
                                                        <tbody>
                                                        {
                                                        (this.state.analysis_SWtoolInfo == '') ?
                                                        <span3>승인된 Sotfware tool이 없습니다.</span3> :
                                                        this.state.analysis_SWtoolInfo
                                                        }
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                    </div>
                                </div>
                                <div className="p_btn_box">
                                    <a href="javascript:" className="p_btn p_btn1 cencel_bt" onClick={(e) => this.selectForAnalyze('cencel_btn', e)} >취소</a>
                                    <a href="javascript:" className="p_btn p_btn2" onClick={(e) => this.selectForAnalyze('', e)}>신청</a>
                                </div>
                            </form>
                        </div>

                    </div>
                </article>
            </section>
        );
    }
}

export default MyProjectWrite;