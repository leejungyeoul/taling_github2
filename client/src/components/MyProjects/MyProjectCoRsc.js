import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import axios from "axios";
import cookie from 'react-cookies';
import Swal from 'sweetalert2'

import $ from 'jquery';

class MyProjectDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isCo_researcher: false,     // 해당 프로젝트에서 공동연구자인 경우
            isResp_researcher: true,    // 해당 프로젝트에서 책임연구자인 경우
            pjtcode: props.match.params.pjtcode, // 리스트에서 선택한 프로젝트 코드

            ownerRsrcher: '', // 책임연구자명
            ownerRsrcherEmail: '', // 책임연구자 이메일

            responseProjectInfo: '',//project 정보 response 변수
            append_PjtInfo: '',     //project 정보 append 변수

            responseParticipantInfo: '',//공동연구자 정보 response 변수
            append_ParticipantInfo: '', //공동연구자 정보 append 변수

            responseDataSrceInfo: '',//datasource 정보 response 변수
            append_DataSrceInfo: '', //datasource 정보 append 변수
            analysis_DataSrceInfo: '', //프로젝트 분석하기 datasource 정보

            responseSWtoolInfo: '',//SWtool 정보 response 변수
            append_SWtoolInfo: '', //SWtool 정보 append 변수
            analysis_SWtoolInfo: '', //프로젝트 분석하기 SWtool 정보

            responseUploadfileInfo: '',//Uploadfile 정보 response 변수
            append_UploadfileInfo: '', //Uploadfile 정보 append 변수

            responseReplyList: '',//댓글 정보 response 변수
            append_ReplyList: '', //댓글 정보 append 변수
            path: '', //연구 파일 다운로드 경로

            //공동연구자 승인 팝업변수
            pjt_name: '', //프로젝트 명
            pjt_period: '', // 프로젝트 기간
            prtipant_flag: '/W', //공동연구 승인여부

            //공동연구자 파일 업로드
            append_fileform:'', //파일 등록 폼  
            file_result: [], // 파일 등록 폼 결과 변수
            selectedFile: null, //업로드 대상 파일
            file_idx: 0, // 파일 인덱스
            responseUploadfileInfo: '',//Uploadfile 정보 response 변수
            append_UploadfileInfo: '', //Uploadfile 정보 append 변수
            uploadFileName:[], // 연구파일명
            uploadFileRegdate:[], //연구파일 등록일자
            uploadFileReguser:[], //연구파일 등록 사용자
            deleteMapperList:['deleteUploadFile'], //삭제할 mapper명

            //프로젝트 분석하기 버튼 노출 flag
            analysis_flag:'Y', // 분석하기 버튼 노출 여부           

            //세션 처리
            usernm:'', //사용자 이름
            userid:'', //사용자 아이디
        }
    }
    
    componentDidMount() {
        //세션 처리
        this.callSessionInfoApi()
        
        setTimeout(function() {
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
                $('.f_more').hide()
                $('.pv_bottom').hide()
                $('.submit_ty1').hide()
                $('.pj_joint').hide()

                $('.bt_ty5').hide()
                
                setTimeout(function() {
                    //파일 업로드 권한 부여
                    if(this.state.prtipant_flag == '/A'){
                        $('.f_more').show()
                        $('.pv_bottom').show()
                        $('.submit_ty1').show()
                        $('.bt_ty5').show()
                    }else if(this.state.prtipant_flag == '/W'){
                        $('.pj_joint').show()
                    }
                }.bind(this),1000
                );
            }.bind(this),700
        );

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
        .catch( error => {this.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기');return false;});
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
                if(this.state.prtipant_flag == '/A'){
                    // 공동연구자 승인한 경우만 파일 다운로드 가능
                    this.setState({ append_UploadfileInfo: this.UploadFileInfoAppend2(node_url) });
                }else{
                    this.setState({ append_UploadfileInfo: this.UploadFileInfoAppend1() });
                }

        } catch (error) {
            this.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기')
        }
    };

    // 프로젝트 상세 연구파일 정보 호출 append
    UploadFileInfoAppend1 = () => {
        try {
            let result = []

            const size = this.state.responseUploadfileInfo.json.length;
            for(let i=0; i<size; i++){

                var file_name = this.state.responseUploadfileInfo.json[i].file_name
                
                var cnt = (i+1)+''
                if(i<10){
                    cnt = '0'+cnt
                }

                result.push(
                    <tr>
                        <th>연구파일{cnt}</th>
                        <td className="fileBox fileBox1">
                            <input type="text" className="fileName fileName1" readOnly="readonly" placeholder={file_name}/>
                            <a href='javascript::' download={file_name} className="f_down" disabled></a>
                        </td>
                    </tr>
                )
            }
                return result
        } catch (error) {
            this.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기')
        }
    }

    // 프로젝트 상세 연구파일 정보 호출 append
    UploadFileInfoAppend2 = (node_url) => {
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
                            <a href="#n" id ={file_name} reg_user={reg_user} onClick={(e) => this.fileDelete('asis',e)} className="c_del"></a>
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

            if(this.state.responseProjectInfo.json[0].pjt_status_cd != 'RS2' && this.state.responseProjectInfo.json[0].pjt_status_cd != 'RS4'){
                this.state.analysis_flag = 'N'
            }

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
                if(this.state.responseParticipantInfo.json[i].ptc_useremail == this.state.userid){
                    this.state.prtipant_flag = flag
                }
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
            this.setState({ analysis_DataSrceInfo: this.DataSrceInfoAppend('anly') });
        } catch (error) {
            this.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기')            
        }
    };

    // 프로젝트 상세 datasource 정보 append
    DataSrceInfoAppend = (type) => {
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
            setTimeout(function() {
                this.setState({ append_SWtoolInfo: this.SWtoolInfoAppend() });
                this.setState({ analysis_SWtoolInfo: this.SWtoolInfoAppend('anly') });
                }.bind(this),300
            );
        } catch (error) {
            this.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기')            
        }
    };

    // 프로젝트 상세 SWtool 정보 append
    SWtoolInfoAppend = (type) => {
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
                            <tr id={swt_code} name={this.state.responseSWtoolInfo.json[i].swt_toolname} onMouseEnter={e => this.InfoHover(swt_code,e)} onMouseLeave={e => this.InfoLeave(swt_code,e)} onClick={(e) => this.infoClick2(swt_code,e)}>
                            <th><img src={imgpath} alt="" /></th>
                            <td>{this.state.responseSWtoolInfo.json[i].swt_toolname}
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

        var reply_code = e.target.getAttribute('id')
        
        if(type == 'delete_reply'){
            var cookie_userid = this.state.userid
            if(e.target.getAttribute('email') == cookie_userid){
                var callReplyListApi = this.callReplyListApi;
                var sweetalert = this.sweetalert;
                var pjtcode = this.state.pjtcode;

                this.sweetalertDelete('정말 삭제하시겠습니까?', function() {
                    axios.post('/api/Resrchpjt?type='+type, {
                        is_Reply_code : reply_code,
                    })
                    .then( response => {
                        // 댓글 정보 호출
                        callReplyListApi(pjtcode)
                    })
                    .catch( response => { sweetalert('작업중 오류가 발생하였습니다.', response, 'error', '닫기');} );
                })
            }else{
                this.sweetalert('내가 작성한 댓글만 삭제 가능합니다.', '', 'info', '닫기')
            }
        }else{
            var cookie_username = this.state.usernm
            var cookie_userid = this.state.userid

            this.reply_val_checker = $('#reply_val').val();
            var reply_code = e.target.getAttribute('id')

            axios.post('/api/Resrchpjt?type='+type, {
                is_reply_contents: this.reply_val_checker,
                is_Pjt_code : this.state.pjtcode,
                is_Username : cookie_username,
                is_Email : cookie_userid,
                is_Reply_code : reply_code,
            })
            .then( response => {
                // 댓글 정보 호출
                this.callReplyListApi(this.state.pjtcode)
            })
            .catch( response => { this.sweetalert('작업중 오류가 발생하였습니다.', response, 'error', '닫기')} );
        }

    };

    //공동연구자 팝업 클릭
    AcceptedOrDeniedClick () {
        $('.pop_project3').fadeIn();		
    }

    //공동연구자 참여 취소
    AcceptCencelClick = (e) => {
        
        var thiss = this
        this.sweetalertCancel('정말 취소하시겠습니까?', function() {
            var cookie_userid = thiss.state.userid
            axios.post('/api/Myproject?type=parti_cencel', {
                is_ProjectCd : thiss.state.pjtcode,
                is_Email : cookie_userid
            })
            .then( response => {
                thiss.sweetCbalert('공동연구자 참여 취소가 완료되었습니다.', '', 'info', '닫기', function() {
                    var cookie_username = thiss.state.usernm
                    var pjt_name =  thiss.state.responseProjectInfo.json[0].pjt_name
                    thiss.sendNoticeMessage(thiss.state.ownerRsrcherEmail, cookie_username+'님이 '+pjt_name+' 프로젝트 공동연구자 참여를 취소했습니다.')
                    thiss.sendEmail(thiss.state.ownerRsrcherEmail, 'rtrod 프로젝트 공동연구자 참여 취소', cookie_username+'님이 '+pjt_name+' 프로젝트 공동연구자 참여를 취소했습니다.')
                    thiss.saveLogMessage('LG4','공동연구자 참여를 취소했습니다. 책임연구자 이메일 : '+thiss.state.ownerRsrcherEmail+' 프로젝트 코드 : '+thiss.state.pjtcode+' 프로젝트명 : '+pjt_name)
        
                    axios.get('/api/cmpathinfo')
                    .then(function (response) {
                        window.location.href = response.data.home_url;
                    })
                })
            })
            .catch( error => {thiss.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기')});  
        })
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

    //책임연구자에게 메일발송
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

    //공동연구자 승인/반려
    AcceptClick (type, e){
        var ptc_flag = ''
        var replace_txt = '(승인대기)'
        if(type == 'accept'){
            ptc_flag = '/A'
            var replace_txt = '<span1>(승인)</span1>'
            this.state.prtipant_flag = '/A'
        }else if(type == 'denied'){
            ptc_flag = '/R'
            var replace_txt = '<span2>(반려)</span2>'
            this.state.prtipant_flag = '/R'
        }
        
        var cookie_userid = this.state.userid
        var cookie_username = this.state.usernm
        axios.post('/api/Resrchpjt?type=update_prticipt', {
            is_Pjt_code : this.state.pjtcode,
            is_Email : cookie_userid,
            is_PtcFlag : ptc_flag,
        })
        .then( response => {
            var cellText = ''
            $('.replacetext').each(function() {
                cellText = $(this).html();    
            });
            cellText =  cellText.replace(cookie_username+'(승인대기)', cookie_username+replace_txt)
            cellText =  cellText.replace(cookie_username+'<span1>(승인)</span1>', cookie_username+replace_txt)
            cellText =  cellText.replace(cookie_username+'<span2>(반려)</span2>', cookie_username+replace_txt)
            $('.replacetext').html(cellText);
        })
        .catch( error => { this.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기')} );

        $('.pop_project').fadeOut();
        $("html").css("overflow","visible");
        $("body").css("overflow","visible");

        if(this.state.prtipant_flag == '/A'){
            $('.f_more').show()
            $('.pv_bottom').show()
            $('.submit_ty1').show()
            $('.bt_ty5').show()
            if(this.state.analysis_flag == 'Y'){
            }
            $('.pj_joint').hide()
            var pjt_name = this.state.responseProjectInfo.json[0].pjt_name
            this.sendNoticeMessage(this.state.ownerRsrcherEmail, cookie_username+'님이 '+pjt_name+' 프로젝트 공동연구자 참여를 승인했습니다.')
            this.sendEmail(this.state.ownerRsrcherEmail, 'rtrod 프로젝트 공동연구자 참여 승인', cookie_username+'님이 '+pjt_name+' 프로젝트 공동연구자 참여를 승인했습니다.')
            this.saveLogMessage('LG4','공동연구자 신청을 승인했습니다. 책임연구자 이메일 : '+this.state.ownerRsrcherEmail+' 프로젝트 코드 : '+this.state.pjtcode+' 프로젝트명 : '+pjt_name)
        }else if(this.state.prtipant_flag == '/R'){
            $('.f_more').hide()
            $('.pv_bottom').hide()
            $('.submit_ty1').hide()
            $('.bt_ty5').hide()
            $('.pj_joint').hide()
            var pjt_name = this.state.responseProjectInfo.json[0].pjt_name
            this.sendNoticeMessage(this.state.ownerRsrcherEmail, cookie_username+'님이 '+pjt_name+' 프로젝트 공동연구자 참여를 반려했습니다.')
            this.sendEmail(this.state.ownerRsrcherEmail, 'rtrod 프로젝트 공동연구자 참여 반려', cookie_username+'님이 '+pjt_name+' 프로젝트 공동연구자 참여를 반려했습니다.')
            this.saveLogMessage('LG4','공동연구자 신청을 반려했습니다. 책임연구자 이메일 : '+this.state.ownerRsrcherEmail+' 프로젝트 코드 : '+this.state.pjtcode+' 프로젝트명 : '+pjt_name)
        }else{//승인대기
            $('.f_more').hide()
            $('.pv_bottom').hide()
            $('.submit_ty1').hide()
            $('.bt_ty5').hide()
        }
        this.callUploadFileInfoApi(this.state.pjtcode)
    }

    // 연구파일 추가
    appendfileform = (e) => {
        this.setState({ append_fileform : this.append_form()});
    }

    // 연구파일 form append
    append_form = (e) => {
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
        }).catch(error => {
            this.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기')                
        })
    }

    // 파일삭제
    fileDelete = (type, e) => {
        var cookie_userid = this.state.userid
        
        if(type == 'asis'){
            if(e.target.getAttribute('reg_user') == cookie_userid){
    
                var target_id = e.target.id
                this.sweetalertDelete('정말 삭제하시겠습니까?', function() {
                    $("input[id='"+target_id+"']").remove()
                    $("tr[id='"+target_id+"']").remove()
            
                    $("input[classname='"+target_id+"']").remove()
                    $("tr[class='"+target_id+"']").css("display", "none")
                })
            }else{
                this.sweetalert('내가 업로드한 파일만 삭제 가능합니다.', '', 'info', '닫기')
            }
        }else{
            $("input[id='"+e.target.id+"']").remove()
            $("tr[id='"+e.target.id+"']").remove()
    
            $("input[classname='"+e.target.id+"']").remove()
            $("tr[class='"+e.target.id+"']").css("display", "none")
        }
    }


    // 공동연구자 연구파일 경로 저장
    saveClick = async (type, e) => {
        //업로드한 파일명을 배열에 저장
        var uploadfileArr = $("input[name='arr_filename']").length;
        this.state.uploadFileName = new Array(uploadfileArr);
        for(var i=0; i<uploadfileArr; i++){                          
            this.state.uploadFileName[i] = $("input[name='arr_filename']")[i].value;
            this.state.uploadFileRegdate[i] = $("input[name='arr_reg_date']")[i].value;
            this.state.uploadFileReguser[i] = $("input[name='arr_reg_user']")[i].value;
        }
        this.delete_bofore_file()
    }

    // delete_bofore_file
    delete_bofore_file = (e) => {
        axios.post('/api/Myproject?type=rollback', {
            is_ProjectCd : this.state.pjtcode,
            arr_MapperList : this.state.deleteMapperList
        })
        .then( response => {
            this.insertUploadFile()
        })
        .catch( error => {this.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기')} );  
    }

    // 연구파일 수정
    insertUploadFile = (e) => {
        if(this.state.uploadFileName == ''){
            this.sweetalert('저장할 파일이 없습니다.', '', 'info', '닫기')
        }else{
            // 업로드 파일명 저장
            try {
                axios.post('/api/Myproject?type=uploadfile', {
                    arr_UploadFile: this.state.uploadFileName,
                    arr_UploadFileDate: this.state.uploadFileRegdate,
                    arr_UploadFileUser: this.state.uploadFileReguser,
                    is_Email : this.state.userid,
                    is_ProjectCd : this.state.pjtcode
                })
                .then( response => {
                    this.sweetalertSucc('연구정보 수정이 완료되었습니다.', false)
                    //home url 호출
                    setTimeout(function() {
                        axios.get('/api/cmpathinfo')
                        .then(function (response) {
                            window.location.href = response.data.home_url;
                        })
                        }.bind(this),1500
                    );
                })
                .catch( error => {this.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기')} );   
                
            } catch (error) {
                this.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기')
            }
        }
    }

    //알림 메시지 전송
    sendNoticeMessage = (receiver, message, e) => {
        axios.post('/api/message?type=push', {
            is_Receiver : receiver,
            is_Message : message,
            is_Pjtcode : this.state.pjtcode
        })
        .then( response => {
        })
        .catch( error => {this.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기')} ); 
    }

    //  레이어 팝업 노출(달력 제외)
    openlayerPopup = (href, e) => {
        $(href).fadeIn();		
        $("html").css("overflow","hidden");
        $("body").css("overflow","hidden");
    }

    // 프로젝트 분석하기 팝업 영역 마우스 hover 이벤트
    InfoHover (type, e) {

        let current_target = e.target;
        $(current_target).parent('tr').addClass('tr_select');

        this.setState({ analysis_DataSrceInfo: this.DataSrceInfoAppend('anly') });
        this.setState({ analysis_SWtoolInfo: this.SWtoolInfoAppend('anly') });
    }
    
    // 프로젝트 분석하기 팝업 영역 마우스 Leave 이벤트
    InfoLeave (type, e) {

        let current_target = e.target;
        $(current_target).parent('tr').removeClass('tr_select');
        
        this.setState({ analysis_DataSrceInfo: this.DataSrceInfoAppend('anly') });
        this.setState({ analysis_SWtoolInfo: this.SWtoolInfoAppend('anly') });
    }

    // 프로젝트 분석하기 팝업 영역 마우스 Click 이벤트
    infoClick (type, e) {
        let current_target = e.target;
        $('tr').removeClass('tr_select');
        $('tr').removeClass('tr_click');
        $(current_target).parents('tr').addClass('tr_click');
    }

    // 프로젝트 분석하기 팝업 영역 마우스 Click 이벤트
    infoClick2 (type, e) {
        let current_target = e.target;
        $('tr').removeClass('tr_select');
        $('tr').removeClass('tr_click2');
        $(current_target).parents('tr').addClass('tr_click2');
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

    //alert 기본 콜백 함수 
    sweetCbalert = (title, contents, icon, confirmButtonText, callbackFunc) => {
        Swal.fire({
            title: title,
            text: contents,
            icon: icon,
            confirmButtonText: confirmButtonText,
            timer: 1000
        }).then(callbackFunc())
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

    render () {
        return (
            <section className="sub_wrap">
                <article className="s_cnt mp_pro_li ct1">
                    <div className="li_top">
                        <h2 className="s_tit1">project 상세보기</h2>
                        <div className="pv_bt af">
                            <div>
                                <a className="bt_ty4 pj_joint" onClick={this.AcceptedOrDeniedClick}>공동연구자 참여 승인·반려</a>
                                <a className="bt_ty5" onClick={this.AcceptCencelClick} >공동연구자 참여 취소</a>
                            </div>
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
                                <a href="javascript::" className="f_more" onClick={(e) => this.appendfileform(e)}></a>
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
                            <div className="pvb_write">
                                <textarea id= "reply_val" name="is_ReplyContents" rows="" cols="" placeholder="글을 입력해주세요."></textarea>
                                <a href="javascript:" className="submit" onClick={(e) => this.submitClick('save_reply', e)} >등록하기</a>
                            </div>
                            <div className="pvb_cont">
                                <div className="table_cont">
                                    <ul>
                                        {this.state.append_ReplyList}
                                    </ul>
                                </div>
                            </div>
                            <div className="menu">
                                <Link to={'/'} className="bt_ty bt_ty2 bt_ty2_1">목록</Link>
                                <a href="javascript:" className="bt_ty bt_ty2 submit_ty1" onClick={(e) => this.saveClick('save', e)}>저장</a> 
                            </div>
                        </div>
                    </div>
                    <div className="pop_project pop_project3">
                        <h2 className="p_title">공동연구자 승인</h2>
                        <form name="" id="" onSubmit={this.handleSubmit}>
                        <div className="pj_wrap">
                            <ul>
                            <li><span className="pj_th">연구명</span>{this.state.pjt_name}</li>
                            <li><span className="pj_th">책임연구자</span>{this.state.ownerRsrcher}</li>
                            <li><span className="pj_th">연구기간</span>
                                <span>{this.state.pjt_period}</span></li>
                            <li className="gray_box">
                                '<span>{this.state.ownerRsrcher}</span>'님이 '<span>{this.state.pjt_name}</span>'의 공동연구자로 초대하였습니다.<br/>
                                <b><span>'{this.state.pjt_name}'</span> 공동연구자 참여를 승인</b>하시겠습니까?
                            </li>
                            </ul>
                        </div>
                        <div className="p_btn_box">
                            <a className="p_btn p_btn1 cencel_bt" onClick={(e) => this.AcceptClick('denied',e)}>반려</a>
                            <a className="p_btn p_btn2" onClick={(e) => this.AcceptClick('accept',e)}>승인</a>
                        </div>
                        </form>
                    </div>

                </article>
            </section>
        )
    }
}


export default MyProjectDetail;