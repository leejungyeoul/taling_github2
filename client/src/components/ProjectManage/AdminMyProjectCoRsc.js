import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import axios from "axios";
import cookie from 'react-cookies';
import Swal from 'sweetalert2'
import $ from 'jquery';

class AdminMyProjectDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isCo_researcher: false,     // 해당 프로젝트에서 공동연구자인 경우
            isResp_researcher: true,    // 해당 프로젝트에서 책임연구자인 경우
            pjtcode: props.match.params.pjtcode, // 리스트에서 선택한 프로젝트 코드

            ownerRsrcher: '', // 책임연구자
            ownerRsrcherEmail: '', // 책임연구자 이메일

            responseProjectInfo: '',//project 정보 response 변수
            append_PjtInfo: '',     //project 정보 append 변수

            responseParticipantInfo: '',//공동연구자 정보 response 변수
            append_ParticipantInfo: '', //공동연구자 정보 append 변수

            responseDataSrceInfo: '',//datasource 정보 response 변수
            append_DataSrceInfo: '', //datasource 정보 append 변수

            responseSWtoolInfo: '',//SWtool 정보 response 변수
            append_SWtoolInfo: '', //SWtool 정보 append 변수

            responseReplyList: '',//댓글 정보 response 변수
            append_ReplyList: '', //댓글 정보 append 변수
            path: '', //연구 파일 다운로드 경로

            //공동연구자 승인 팝업변수
            pjt_name: '', // 프로젝트명
            pjt_period: '', //프로젝트 기간
            prtipant_flag: '/W',

            //공동연구자 파일 업로드
            append_fileform:'', // 파일 폼     
            file_result: [], // 파일 폼 결과
            selectedFile: null, //업로드 대상 파일
            file_idx: 0, // 파일 인덱스
            responseUploadfileInfo: '',//Uploadfile 정보 response 변수
            append_UploadfileInfo: '', //Uploadfile 정보 append 변수

            //연장 연구기간
            startday:'', // 시작일자
            endday:'',   // 종료일자
            delay_flag:'', // 승인 여부

            //관리자 세션 처리
            admin_usernm:'', //관리자 이름
            admin_userid:'', //관리자 아이디
        }
    }
    
    componentDidMount() {
        //세션처리
        this.callSessionInfoApi()
        // 연장 연구기간 호출
        this.callPostponePeriodApi(this.state.pjtcode)
        // 프로젝트 상세 연구정보 호출
        this.callResrchInfoApi(this.state.pjtcode)
        // 공동연구자 정보 호출
        this.callparticipantInfoApi(this.state.pjtcode)
        // datasource 정보 호출
        this.callDataSrceInfoApi(this.state.pjtcode)
        // SWtool 정보 호출
        this.callSWtoolInfoApi(this.state.pjtcode)
        // 연구파일 정보 호출
        this.callUploadFileInfoApi(this.state.pjtcode)
        // 댓글 정보 호출
        this.callReplyListApi(this.state.pjtcode)
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

                        // this.state.startday = startday.substr(0,8)
                        var start_year = startday.substr(0,4)
                        var start_month = startday.substr(4,2)
                        var start_day = startday.substr(6,2)
                        this.state.startday = start_year + '.' + start_month + '.' +start_day

                        // this.state.endday = endday.substr(0,8)
                        var end_year = endday.substr(0,4)
                        var end_month = endday.substr(4,2)
                        var end_day = endday.substr(6,2)
                        this.state.endday = end_year + '.' + end_month + '.' +end_day

                        this.state.delay_flag = response.data.json[0].delay_flag
                        var poststat = ''

                        $('#postpone_prepend').empty()
                        if(this.state.delay_flag == '/W'){
                            $('#postpone_prepend').prepend(this.state.startday +'~'+this.state.endday);
                        }else if(this.state.delay_flag == '/A'){
                            $('.postpone').hide()
                            poststat = ' (승인)'
                            $('#postpone_prepend').prepend(this.state.startday +'~'+this.state.endday + '<span1>'+poststat+'</span1>');
                        }else if(this.state.delay_flag == '/R'){
                            $('.postpone').hide()
                            poststat = ' (반려)'
                            $('#postpone_prepend').prepend(this.state.startday +'~'+this.state.endday + '<span2>'+poststat+'</span2>');
                        }
                    }else{
                        $('#postpone_button').empty()
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

    // Postpone 승인/반려
    PostponeApproval = (type, e) => {
        var post_flag = ''
        var tmp_this = this
        if(type  =='Approval'){
            post_flag = '/A'
            this.sweetalertApproval('정말 승인하시겠습니까?', function() {
                tmp_this.PostponeApprovalApiCall(post_flag)
            })
        }else if(type == 'Reject'){
            post_flag = '/R'
            this.sweetalertReject('정말 반려하시겠습니까?', function() {
                tmp_this.PostponeApprovalApiCall(post_flag)
            })
        }
    }
    
    // Postpone 승인/반려 Api call
    PostponeApprovalApiCall = (post_flag, e) => {
        axios.post('/api/Myproject?type=PostApproval', {
            is_Pjt_code : this.state.pjtcode,
            is_Delay_flag : post_flag,
        })
        .then( response => {
            this.callPostponePeriodApi(this.state.pjtcode)
            //프로젝트 상태 연장요청으로 변경
            this.updatePjtstatus('RS2')
            if(post_flag == '/A'){
                this.updateOriginPeriod()
                this.sendNoticeMessage(this.state.ownerRsrcherEmail, '관리자님이 '+this.state.pjt_name+' 프로젝트 연구기간 연장을 승인했습니다.')
                this.sendEmail(this.state.ownerRsrcherEmail, 'rtrod 연구기간 연장 승인', '관리자님이 '+this.state.pjt_name+' 프로젝트 연구기간 연장을 승인했습니다.')
                this.saveLogMessage('LG5','연구기간 연장을 승인했습니다. 연장기간 : '+this.state.startday +'~'+this.state.endday+' 프로젝트명 : '+this.state.pjt_name)
            }else if(post_flag == '/R'){
                this.sendNoticeMessage(this.state.ownerRsrcherEmail, '관리자님이 '+this.state.pjt_name+' 프로젝트 연구기간 연장을 반려했습니다.')
                this.saveLogMessage('LG5','연구기간 연장을 반려했습니다. 연장기간 : '+this.state.startday +'~'+this.state.endday+' 프로젝트명 : '+this.state.pjt_name)
            }
        })
        .catch( error => {this.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기');return false;} );
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
        .catch( error => {this.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기'); return false;});
    }

    // 연기기간 연장연구기간으로 수정
    updateOriginPeriod = (e) => {
        axios.post('/api/Myproject?type=updateOriginPeriod', {
            is_Pjt_code : this.state.pjtcode,
        })
        .then( response => {
        })
        .catch( error => {this.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기');return false;} );
    }

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
            for(let i=0; i<size; i++){

                var file_name = this.state.responseUploadfileInfo.json[i].file_name
                var reg_user = this.state.responseUploadfileInfo.json[i].reg_user
                var reg_date = this.state.responseUploadfileInfo.json[i].reg_date
                var path = node_url+'/'+file_name;

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
                            {/* <a href="#n" id ={file_name} reg_user={reg_user} onClick={(e) => this.fileDelete('asis',e)} className="c_del"></a> */}
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
            this.setState({ append_PjtInfo: this.ResrchpjtInfoAppend() });
        } catch (error) {
            this.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기')
        }
    };

    // 프로젝트 상세 연구정보 정보 append
    ResrchpjtInfoAppend = () => {
        let result = []

            var date = this.state.responseProjectInfo.json[0].pjt_start_date
            var year = date.substr(0,4)
            var month = date.substr(4,2)
            var day = date.substr(6,2)
            var pjt_startdate = year +'.'+month+'.'+day

            date = this.state.responseProjectInfo.json[0].pjt_end_date
            year = date.substr(0,4)
            month = date.substr(4,2)
            day = date.substr(6,2)
            var pjt_enddate = year +'.'+month+'.'+day
            this.state.ownerRsrcher = this.state.responseProjectInfo.json[0].pjt_owner
            this.state.ownerRsrcherEmail = this.state.responseProjectInfo.json[0].pjt_owner_email
            
            
            //공동연구자 팝업 승인 팝업 변수 세팅
            this.state.pjt_name = this.state.responseProjectInfo.json[0].pjt_name
            this.state.pjt_period = pjt_startdate + '~' + pjt_enddate

            result.push(
                    <tbody>
                        <tr>
                            <th>연구명</th>
                            <td>{this.state.responseProjectInfo.json[0].pjt_name}</td>
                        </tr>
                        <tr>
                            <th>책임연구자</th>
                            <td>{this.state.responseProjectInfo.json[0].pjt_owner}</td>
                        </tr>
                        <tr>
                            <th>구분</th>
                            <td>{this.state.responseProjectInfo.json[0].pjt_type}</td>
                        </tr>
                        <tr>
                            <th>상태</th>
                            <td>{this.state.responseProjectInfo.json[0].pjt_status}</td>
                        </tr>
                        <tr>
                            <th>연구기간</th>
                            <td>{pjt_startdate} ~ {pjt_enddate} <span>(Day - {this.state.responseProjectInfo.json[0].pjt_ddday})</span></td>
                        </tr>
                        <tr>
							<th>연장 연구기간</th>
							<td id='postpone_button'><span0 id='postpone_prepend'></span0>&nbsp;&nbsp;
								<a href="#n" class="bt_c1 w50_b postpone" onClick={(e) => this.PostponeApproval('Approval', e)}>승인</a>&nbsp;
								<a href="#n" class="bt_c1 bt_c2 w50_b postpone" onClick={(e) => this.PostponeApproval('Reject', e)}>반려</a>
							</td>
						</tr>
                        <tr>
                            <th>연구분야</th>
                            <td>{this.state.responseProjectInfo.json[0].pjt_field}</td>
                        </tr>
                        <tr>
                            <th className="last_th">연구내용</th>
                            <td>{this.state.responseProjectInfo.json[0].pjt_contents}</td>
                        </tr>
                    </tbody>
            )
        return result
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
            this.setState({ append_ParticipantInfo: this.ParticipantInfoAppend() });
        } catch (error) {
            this.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기')
        }
    };

    // 프로젝트 상세 공동연구자 리스트 append
    ParticipantInfoAppend = () => {
        try {
            let result = []
            var Participantlist = ''
            const size = this.state.responseParticipantInfo.json.length;
            for(let i=0; i<size; i++){
                var flag = this.state.responseParticipantInfo.json[i].ptc_flag
                var txt = '(승인대기)'
                if(flag == '/W'){
                    //승인대기
                }else if(flag == '/A'){
                    txt = <span1>(승인)</span1>
                }else if(flag == '/R'){
                    txt = <span2>(반려)</span2>
                }
                Participantlist = this.state.responseParticipantInfo.json[i].ptc_username
                if(i != (size-1)){
                    result.push(
                        <span0>{Participantlist}{txt},</span0>
                    )
                }else{
                    result.push(
                        <span0>{Participantlist}{txt}</span0>
                    )
                }
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
            this.setState({ append_DataSrceInfo: this.DataSrceInfoAppend() });
        } catch (error) {
            this.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기')
        }
    };

    // 프로젝트 상세 datasource 정보 append
    DataSrceInfoAppend = () => {
        try {
            let result = []

            const size = this.state.responseDataSrceInfo.json.length;
            for(let i=0; i<size; i++){
                var imgpath = this.state.responseDataSrceInfo.json[i].ds_imagepath
                var uds_code = this.state.responseDataSrceInfo.json[i].uds_code
                var uds_flag = this.state.responseDataSrceInfo.json[i].uds_flag
                var uds_pjt_code = this.state.responseDataSrceInfo.json[i].uds_pjt_code
                var ds_dbname = this.state.responseDataSrceInfo.json[i].ds_dbname
                
                imgpath = '/image/'+imgpath

                var style = {display:'none'}
                var txt = ''
                if(uds_flag == '/W'){
                    style = {display:''}
                }else if(uds_flag == '/A'){
                    txt = <span1>(승인)</span1>
                }else if(uds_flag == '/R'){
                    txt = <span2>(반려)</span2>
                }

                result.push(
                    <tr>
                        <th><img src={imgpath} alt="" /></th>
                        <td>{this.state.responseDataSrceInfo.json[i].ds_dbname} ({this.state.responseDataSrceInfo.json[i].ds_holdorg} / {this.state.responseDataSrceInfo.json[i].ds_typenm})
                        &nbsp;{txt}&nbsp;
                        <a href="#n" uds_code={uds_code} uds_pjt_code={uds_pjt_code} ds_dbname={ds_dbname} class="bt_c1 w50_b" onClick={(e) => this.DsApproval('Approval', e)} style={style}>승인</a>&nbsp;
                        <a href="#n" uds_code={uds_code} uds_pjt_code={uds_pjt_code} ds_dbname={ds_dbname} class="bt_c1 bt_c2 w50_b" onClick={(e) => this.DsApproval('Reject', e)} style={style}>반려</a>
                        </td>
                    </tr>
                )
            }
            return result
        } catch (error) {
            this.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기')
        }
    }

    // DataSource 승인/반려
    DsApproval = (type, e) => {
        var uds_flag = ''
        var tmp_this = this
        var event_target =  e.target

        if(type  =='Approval'){
            uds_flag = '/A'
            this.sweetalertApproval('정말 승인하시겠습니까?', function() {
                tmp_this.DsApprovalApiCall(uds_flag, event_target)
            })
        }else if(type == 'Reject'){
            uds_flag = '/R'
            this.sweetalertReject('정말 반려하시겠습니까?', function() {
                tmp_this.DsApprovalApiCall(uds_flag, event_target)
            })
        }
    }
    
    // Datasource 승인/반려 Api call
    DsApprovalApiCall = (uds_flag, event_target, e) => {
        var uds_code =  event_target.getAttribute('uds_code')
        var uds_pjt_code =  event_target.getAttribute('uds_pjt_code')
        var ds_dbname =  event_target.getAttribute('ds_dbname')
        
        axios.post('/api/Myproject?type=DsApproval', {
            is_Uds_code : uds_code,
            is_Uds_pjt_code : uds_pjt_code,
            is_Uds_flag : uds_flag,
        })
        .then( response => {
            this.callDataSrceInfoApi(this.state.pjtcode)
            //하나라도 승인하면 프로젝트 상태 진행으로 변경
            var approFlag = '반려'
            if(uds_flag == '/A'){
                this.updatePjtstatus('RS2')
                approFlag = '승인'
            }
    
            this.sendNoticeMessage(this.state.ownerRsrcherEmail, '관리자님이 '+ds_dbname+' Data source 사용을 '+approFlag+'했습니다.')
            this.sendEmail(this.state.ownerRsrcherEmail, 'rtrod Data source 승인 결과', '관리자님이 '+ds_dbname+' Data source 사용을 '+approFlag+'했습니다.')
            this.saveLogMessage('LG3','사용 Data Source를 '+approFlag+'했습니다. Data Source 코드 : '+uds_code+' Data Source 명 : '+ds_dbname+' 프로젝트 코드 : '+uds_pjt_code)
        })
        .catch( error => {this.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기');return false;} );
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
            var tmp_this = this
            this.setState({ append_SWtoolInfo: this.SWtoolInfoAppend(function() {
                setTimeout(function() {
                    const size = tmp_this.state.responseSWtoolInfo.json.length;
                    for(let i=0; i<size; i++){
                        var usw_code = tmp_this.state.responseSWtoolInfo.json[i].usw_code
                        var usw_url = tmp_this.state.responseSWtoolInfo.json[i].usw_url
                        usw_code = '#'+usw_code
                        $(usw_code).val(usw_url)
                    }
                }.bind(this),1000
                );

            }) });
        } catch (error) {
            this.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기')         
        }
    };

    // 프로젝트 상세 SWtool 정보 append
    SWtoolInfoAppend = (callbackFunc) => {
        try {
            let result = []

            const size = this.state.responseSWtoolInfo.json.length;
            for(let i=0; i<size; i++){
                var imgpath = this.state.responseSWtoolInfo.json[i].swt_imagepath
                var usw_code = this.state.responseSWtoolInfo.json[i].usw_code
                var usw_flag = this.state.responseSWtoolInfo.json[i].usw_flag
                var usw_pjt_code = this.state.responseSWtoolInfo.json[i].usw_pjt_code
                var swt_toolname = this.state.responseSWtoolInfo.json[i].swt_toolname

                var usw_url = this.state.responseSWtoolInfo.json[i].usw_url
                
                imgpath = '/image/'+imgpath

                var style = {display:'none'}
                var txt = ''
                if(usw_flag == '/W'){
                    style = {display:''}
                }else if(usw_flag == '/A'){
                    txt = <span1>(승인)</span1>
                }else if(usw_flag == '/R'){
                    txt = <span2>(반려)</span2>
                }
                result.push(
                    <tr>
                        <th><img src={imgpath} alt="" /></th>
                        <td>{this.state.responseSWtoolInfo.json[i].swt_toolname}&nbsp;{txt}&nbsp;
                        <a href="#n" usw_code={usw_code} usw_pjt_code={usw_pjt_code} swt_toolname={swt_toolname} class="bt_c1 w50_b" onClick={(e) => this.SwApproval('Approval', e)} style={style}>승인</a>&nbsp;
                        <a href="#n" usw_code={usw_code} usw_pjt_code={usw_pjt_code} swt_toolname={swt_toolname} class="bt_c1 bt_c2 w50_b" onClick={(e) => this.SwApproval('Reject', e)} style={style}>반려</a>&nbsp;
                        <a href="#n" usw_code={usw_code} usw_pjt_code={usw_pjt_code} swt_toolname={swt_toolname} class="bt_c1 bt_c2 w50_c" onClick={(e) => this.SwURLupdate(e)}>URL 수정</a>&nbsp;&nbsp;&nbsp;
                        <input id={usw_code}  type="text" name="is_Url" placeholder='http://'/>
                        </td>
                    </tr>
                )
            }
            callbackFunc()
            return result
        } catch (error) {
            this.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기')
        }
    }

    // SWTool 승인/반려
    SwApproval = (type, e) => {
        var usw_flag = ''
        var tmp_this = this
        var event_target =  e.target

        if(type  =='Approval'){
            usw_flag = '/A'
            this.sweetalertApproval('정말 승인하시겠습니까?', function() {
                tmp_this.SwApprovalApiCall(usw_flag, event_target)
            })
        }else if(type == 'Reject'){
            usw_flag = '/R'
            this.sweetalertReject('정말 반려하시겠습니까?', function() {
                tmp_this.SwApprovalApiCall(usw_flag, event_target)
            })
        }
    }

    // Softwaretool 승인/반려 Api call
    SwApprovalApiCall = (usw_flag, event_target, e) => {
        
        var usw_code =  event_target.getAttribute('usw_code')
        var usw_pjt_code =  event_target.getAttribute('usw_pjt_code')
        var swt_toolname =  event_target.getAttribute('swt_toolname')

        axios.post('/api/Myproject?type=SwApproval', {
            is_Usw_code : usw_code,
            is_Usw_pjt_code : usw_pjt_code,
            is_Usw_flag : usw_flag,
        })
        .then( response => {
            this.callSWtoolInfoApi(this.state.pjtcode)
            //하나라도 승인하면 프로젝트 상태 진행으로 변경
            var approFlag = '반려'
            if(usw_flag == '/A'){
                this.updatePjtstatus('RS2')
                approFlag = '승인'
            }
            
            this.sendNoticeMessage(this.state.ownerRsrcherEmail, '관리자님이 '+swt_toolname+' software tool 사용을 '+approFlag+'했습니다.')
            this.sendEmail(this.state.ownerRsrcherEmail, 'rtrod software tool 승인 결과', '관리자님이 '+swt_toolname+' software tool 사용을 '+approFlag+'했습니다.')
            this.saveLogMessage('LG2','사용 Software tool을 '+approFlag+'했습니다. Software tool 코드 : '+usw_code+' Software tool 명 : '+swt_toolname+' 프로젝트 코드 : '+usw_pjt_code)
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

    // SWTool URL 수정
    SwURLupdate = (e) => {
        var event_target = e.target
        var usw_code =  event_target.getAttribute('usw_code')
        var usw_pjt_code =  event_target.getAttribute('usw_pjt_code')
        var url = $('input[id='+usw_code+']').val();

        try {
            axios.post('/api/Swtool?type=update_url', {
                is_Usw_code : usw_code,
                is_Usw_pjt_code : usw_pjt_code,
                is_Url : url
            })
            .then( response => {
                this.sweetalertSucc('URl 저장이 완료되었습니다.', false)
            })
            .catch( error => {this.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기')} );   
            
        } catch (error) {
            this.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기')
        }
    }

    // 프로젝트 상태 변경(등록 > 진행)
    updatePjtstatus = (type, e) => {
        axios.post('/api/Myproject?type=updatePjtStatus', {
            is_Pjt_code : this.state.pjtcode,
            is_Pjt_status : type,
        })
        .then( response => {
            this.callResrchInfoApi(this.state.pjtcode)
        })
        .catch( error => {this.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기'); return false;});
    }

    // 프로젝트 상세 댓글 정보 호출
    callReplyListApi = async (pjtcode) => {
        try {
            //댓글리스트 호출
            axios.post('/api/Resrchpjt?type=read_reply', {
                is_Pjt_code : this.state.pjtcode
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
            if(size == 0){
                $('.pv_bottom').hide()
            }

            for(let i=0; i<size; i++){
                var reply_user_name = this.state.responseReplyList.data.json[i].reply_user_name
                var reply_contents = this.state.responseReplyList.data.json[i].reply_contents
                var update_date = this.state.responseReplyList.data.json[i].update_date
                var reply_code = this.state.responseReplyList.data.json[i].reply_code
                var reply_user_email = this.state.responseReplyList.data.json[i].reply_user_email
                
                result.push(
                    <li>
                        <h3>{reply_user_name}<span>{update_date}</span>
                            <a href="javascript:" id={reply_code} className="c_del c_del_s" email={reply_user_email} onClick={(e) => this.submitClick('delete_reply', e)} ></a>
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
    submitClick = async (type, e) => {
        var cookie_username = this.state.admin_usernm
        var cookie_userid = this.state.admin_userid

        if(type == 'delete_reply'){
            if(e.target.getAttribute('email') == cookie_userid){
                //삭제 권한 부여
                var event_target = e.target
                var tmp_this = this
                this.sweetalertDelete('정말 삭제하시겠습니까?', function() {

                    tmp_this.reply_val_checker = $('#reply_val').val();
            
                    var reply_code = event_target.getAttribute('id')
            
                    axios.post('/api/Resrchpjt?type='+type, {
                        is_reply_contents: tmp_this.reply_val_checker,
                        is_Pjt_code : tmp_this.state.pjtcode,
                        is_Username : cookie_username,
                        is_Email : cookie_userid,
                        is_Reply_code : reply_code,
                    })
                    .then( response => {
                        // 댓글 정보 호출
                        tmp_this.callReplyListApi(tmp_this.state.pjtcode)
                    })
                    .catch( error => {tmp_this.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기')} );
                })
            }else{
                this.sweetalert('내가 작성한 댓글만 삭제 가능합니다.', '', 'info', '닫기')
                return false;
            }
        }
    };

    //알림 메시지 전송
    sendNoticeMessage = (receiver, message, e) => {
        axios.post('/api/message?type=push', {
            is_Receiver : receiver,
            is_Message : message,
            is_Pjtcode : this.state.pjtcode,
        })
        .then( response => {
        })
        .catch( error => {this.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기')} ); 
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

    //alert 승인 함수
    sweetalertApproval = (title, callbackFunc) => {
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
                'Approval!',
                '승인되었습니다.',
                'success'
                )
            }else{
                return false;
            }
            callbackFunc()
            })
    }

    //alert 승인 함수
    sweetalertReject = (title, callbackFunc) => {
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
                'reject!',
                '반려되었습니다.',
                'success'
                )
            }else{
                return false;
            }
            callbackFunc()
            })
    }

    // ### render start ###
    render () {
        return (
            <section className="sub_wrap">
                <article className="s_cnt mp_pro_li ct1">
                    <div className="li_top">
                        <h2 className="s_tit1">project 상세보기</h2>
                        <div className="pv_bt af">
                        </div>
                    </div>
                    <div className="pv_cont">
                        <div className="pv_top">
                            <div className="lbx">
                                <h4 className="title_ty1">연구정보</h4>
                                <table className="table_ty3">
                                   {this.state.append_PjtInfo}
                                </table>
                            </div>

                            <div className="rbx">
                                <h4 className="title_ty1">사용 Data source</h4>
                                <div className="t_wrap">
                                    <table className="table_ty3 table_ty4">
                                        <tbody>
                                            {this.state.append_DataSrceInfo}
                                        </tbody>
                                    </table>
                                </div>
                                <h4 className="title_ty1 mt40">사용 Sotfware tool</h4>
                                <div className="t_wrap t_wrap2">
                                    <table className="table_ty3 table_ty4 table_ty5">
                                        <tbody>
                                            {this.state.append_SWtoolInfo}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        <div className="pv_middle mt40">
                            <div className="lbx">
                                <h4 className="title_ty1">사용자 정보</h4>
                                <table className="table_ty3 table_ty6">
                                    <tbody>
                                        <tr>
                                            <th>책임연구자</th>
                                            <td>{this.state.ownerRsrcher}</td>
                                        </tr>
                                        <tr>
                                            <th className="last_th">공동연구자</th>
                                            <td className="replacetext">
                                                {this.state.append_ParticipantInfo}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="rbx">
                                <h4 className="title_ty1">연구파일
                                </h4>
                                <div className="t_wrap t_wrap3">
                                    <table className="table_ty3 table_ty6 table_ty7">
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
                            <div className="pvb_cont">
                                <div className="table_cont">
                                    <ul>
                                        {this.state.append_ReplyList}
                                    </ul>
                                </div>
                            </div>
                            <div className="menu">
                                <Link to={'/AdminResearchProject'} className="bt_ty bt_ty2 bt_ty2_1">목록</Link>
                            </div>
                        </div>
                    </div>
                </article>
            </section>
        )
    }
}


export default AdminMyProjectDetail;