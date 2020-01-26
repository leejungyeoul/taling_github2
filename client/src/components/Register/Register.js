import React, { Component } from 'react';
import axios from "axios";
import cookie from 'react-cookies';
import Swal from 'sweetalert2'
import $ from 'jquery';

class Register extends Component {
    constructor (props) {
        super(props);
        
        this.state = {
            email2_val_selected: '', // 선택된 이메일 뒷주소
            full_email:'', // 등록용 이메일주소
            full_email2:'', // 수정용 이메일주소

            //세션 처리
            usernm:'', //사용자 이름
            userid:'', //사용자 아이디
        }
    }
    
    componentDidMount() {
        // 세션 처리
        this.callSessionInfoApi()
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
            this.componentDidMount2()
        })
        .catch( error => {this.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기');return false;} );
    }

    componentDidMount2 = () => {
        var useremail = ''
        useremail = this.state.userid

        if(useremail != undefined && useremail != ''){
            axios.post('/api/LoginForm?type=modinfo', { 
                is_Email: useremail
            }) 
            .then( response => {
                try {
                    var fullemail = response.data.json[0].useremail
                    this.state.full_email2 = fullemail
                    var splitemail = fullemail.split('@');
    
                    $('#email_val').val(splitemail[0])
                    $('#email2_val').val(splitemail[1])
                    $('#is_Useremail2').val(splitemail[1])

                    $('#drct_email2_val').val(splitemail[1])
                    if(splitemail[1] !== undefined){
                        // 이메일 뒤 주소 직접입력일 경우
                        if(splitemail[1].indexOf('naver.com/hanmail.net/nate.com/hotmail.com/gmail.com/yahoo.co.kr/yahoo.com') == -1){
                            $('.email2_class').attr('disabled', false);
                            $('#email2_val').val('1')
                            $('#drct_tr').show()
                        }
                    }

                    var fullphone = response.data.json[0].userphone
                    var splitphone = fullphone.split('-');
                    
                    $('#phone1_val').val(splitphone[0])
                    $('#phone2_val').val(splitphone[1])
                    $('#phone3_val').val(splitphone[2])
                    
                    $('#name_val').val(response.data.json[0].username)
                    $('#major_val').val(response.data.json[0].usermajor)
                    $('#org_val').val(response.data.json[0].userorg)
    
                } catch (error) {
                    this.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기')
                }
            })
            .catch( response => {return false;} );

            $("#email_val").attr("readonly",true); 
            $("#email2_val").attr("disabled",true); 
            var tthis = this
            var email_fix_alert = $('#email_val, #email2_val, #drct_email2_val');
            email_fix_alert.focus(function(e){
                this.blur();
            });
        }
        $('#drct_tr').hide()
    }

    // 회원가입 버튼 클릭시 validate check
    submitClick = async (type, e) => {

        this.email_val_checker = $('#email_val').val();
        this.email2_val_checker = $('#email2_val').val();
        this.drct_email2_val_checker = $('#drct_email2_val').val();
        this.pwd_val_checker = $('#pwd_val').val();
        this.pwd_cnf_val_checker = $('#pwd_cnf_val').val();
        this.name_val_checker = $('#name_val').val();

        this.org_val_checker = $('#org_val').val();
        this.major_val_checker = $('#major_val').val();
        this.phone1_val_checker = $('#phone1_val').val();
        this.phone2_val_checker = $('#phone2_val').val();
        this.phone3_val_checker = $('#phone3_val').val();

        this.fnValidate = (e) => {
            var pattern1 = /[0-9]/;	// 숫자
            var pattern2 = /[a-zA-Z]/;	// 문자
            var pattern3 = /[~!@#$%^&*()_+|<>?:{}]/;	// 특수문자

            // ## email check start 
            if(this.email_val_checker === '') {
                $('#email_val').addClass('border_validate_err');
                this.sweetalert('이메일 주소를 다시 확인해주세요.', '', 'info', '닫기')
                return false;
            }
            if(this.email_val_checker.search(/\s/) != -1) {
                $('#email_val').addClass('border_validate_err');
                this.sweetalert('이메일 공백을 제거해 주세요.', '', 'info', '닫기')
                return false;
            }
            $('#email_val').removeClass('border_validate_err');

            if(this.email2_val_checker ==='' || (this.email2_val_checker === '1' && this.drct_email2_val_checker ==='')) {
                $('#email2_val').addClass('border_validate_err');
                $('#drct_email2_val').addClass('border_validate_err');
                this.sweetalert('이메일 주소를 다시 확인해주세요.', '', 'info', '닫기')
                return false;
            }
            $('#email2_val').removeClass('border_validate_err');
            $('#drct_email2_val').removeClass('border_validate_err');
            // ## email check end 

            // ## pwd check start 
            if(this.pwd_val_checker ==='') {
                $('#pwd_val').addClass('border_validate_err');
                this.sweetalert('비밀번호를 입력해주세요.', '', 'info', '닫기')
                return false;
            }
            if(this.pwd_val_checker !='') {
                var str = this.pwd_val_checker;
                if(str.search(/\s/) != -1) {
                        $('#pwd_val').addClass('border_validate_err');
                        this.sweetalert('비밀번호 공백을 제거해 주세요.', '', 'info', '닫기')
                        return false;
                } 
                if(!pattern1.test(str) || !pattern2.test(str) || !pattern3.test(str) || str.length < 8 || str.length > 16) {
                        $('#pwd_val').addClass('border_validate_err');
                        this.sweetalert('8~16자 영문 대 소문자\n숫자, 특수문자를 사용하세요.', '', 'info', '닫기')
                        return false; 
                } 
            }
            $('#pwd_val').removeClass('border_validate_err');

            if(this.pwd_cnf_val_checker ==='') {
                $('#pwd_cnf_val').addClass('border_validate_err');
                this.sweetalert('비밀번호 확인을 입력해주세요.', '', 'info', '닫기')
                return false;
            }
            if(this.pwd_val_checker != this.pwd_cnf_val_checker) {
                $('#pwd_val').addClass('border_validate_err');
                $('#pwd_cnf_val').addClass('border_validate_err');
                this.sweetalert('비밀번호가 일치하지 않습니다.', '', 'info', '닫기')
                return false;
            }
            $('#pwd_cnf_val').removeClass('border_validate_err');
            // ## pwd check end 

            // ## name check start 
            if(this.name_val_checker ==='') {
                $('#name_val').addClass('border_validate_err');
                this.sweetalert('성명을 입력해주세요.', '', 'info', '닫기')
                return false;
            }
            if(this.name_val_checker.search(/\s/) != -1) {
                $('#name_val').addClass('border_validate_err');
                this.sweetalert('성명에 공백을 제거해 주세요.', '', 'info', '닫기')
                return false;
            }
            $('#name_val').removeClass('border_validate_err');
            // ## name check end 
    
            // ## org check start 
            if(this.org_val_checker ==='') {
                $('#org_val').addClass('border_validate_err');
                this.sweetalert('소속기관을 입력해주세요.', '', 'info', '닫기')
                return false;
            }
            if(this.org_val_checker.search(/\s/) != -1) {
                $('#org_val').addClass('border_validate_err');
                this.sweetalert('소속기관에 공백을 제거해 주세요.', '', 'info', '닫기')
                return false;
            }
            $('#org_val').removeClass('border_validate_err');
            // ## org check end

            // ## major check start
            if(this.major_val_checker ==='') {
                $('#major_val').addClass('border_validate_err');
                this.sweetalert('전공을 입력해주세요.', '', 'info', '닫기')
                return false;
            }
            if(this.major_val_checker.search(/\s/) != -1) {
                $('#major_val').addClass('border_validate_err');
                this.sweetalert('전공에 공백을 제거해 주세요.', '', 'info', '닫기')
                return false;
            }
            $('#major_val').removeClass('border_validate_err');
            // ## major check end

            // ## phone nubber check start
            if(this.phone1_val_checker ==='' || this.phone2_val_checker ==='' || this.phone3_val_checker ==='') {
                $('#phone1_val').addClass('border_validate_err');
                $('#phone2_val').addClass('border_validate_err');
                $('#phone3_val').addClass('border_validate_err');

                this.sweetalert('휴대전화 번호를 입력해주세요.', '', 'info', '닫기')
                return false;
            }
            $('#phone1_val').removeClass('border_validate_err');
            $('#phone2_val').removeClass('border_validate_err');
            $('#phone3_val').removeClass('border_validate_err');
            // ## phone nubber check end
            return true;
        }

        //회원 정보 유효성 체크
        if(this.fnValidate()){
            // 이메일 중복 검사
            this.state.full_email = this.email_val_checker+'@'+this.state.email2_val_selected
            axios.post('/api/register?type=dplicheck', {
                is_Email: this.email_val_checker+'@'+this.state.email2_val_selected
            })
            .then( response => {
                try {
                    if(type == 'modify'){
                        this.fnSignInsert('modify', e)
                    }else if(type == 'signup'){
                        const dupli_count = response.data.json[0].num;
                        var cnt = JSON.stringify(dupli_count);
                        if(cnt != '0'){
                            $('#email_val').addClass('border_validate_err');
                            $('#email2_val').addClass('border_validate_err');
                            $('#drct_email2_val').addClass('border_validate_err');
                            this.sweetalert('이미 존재하는 이메일입니다.', '', 'info', '닫기')
                        }else{
                            //이메일이 중복되지 않았다면 회원정보 저장
                            $('#email_val').removeClass('border_validate_err');
                            $('#email2_val').removeClass('border_validate_err');
                            $('#drct_email2_val').removeClass('border_validate_err');
                            this.fnSignInsert('signup', e)
                        }
                    }
                } catch (error) {
                    this.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기')
                }
            })
            .catch( response => { return false; } );
        }//fnValidate end




        // 회원가입 정보 Insert    
        this.fnSignInsert = async (type, e) => {
            //form type To Json
            var jsonstr = $("form[name='frm']").serialize();
            //특수문자 깨짐 해결
            jsonstr = decodeURIComponent(jsonstr);
            var Json_form = JSON.stringify(jsonstr).replace(/\"/gi,'')
            Json_form = "{\"" +Json_form.replace(/\&/g,'\",\"').replace(/=/gi,'\":"')+"\"}";
           
            try {
                const response = await fetch('/api/register?type='+type, {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json',
                    },
                    //한글 디코딩
                    body: Json_form,
                });
                const body = await response.text();
                if(body == "succ"){
                    if(type == 'signup'){
                        this.sweetalert('회원가입이 완료되었습니다.', '', 'info', '닫기')
                        //관리자에게 연장 요청 메시지 전송
                        this.sendNoticeMessage('admin', this.name_val_checker+'님이 사용자 승인 요청을 하였습니다.')
                        this.sendEmail('admin', 'rtrod 사용자 승인 요청', this.name_val_checker+'님이 사용자 승인 요청을 하였습니다.')
                        this.saveLogMessage('LG7',this.name_val_checker+'님이 사용자 승인 요청을 하였습니다. 이메일 : '+this.state.full_email)
                    }else if(type == "modify"){
                        this.sweetalert('나의 정보 수정이 완료되었습니다.', '', 'info', '닫기')
                        this.saveLogMessage('LG7',this.name_val_checker+'님이 사용자정보를 수정 하였습니다. 이메일 : '+this.state.full_email2)
                    }
                    this.logout()
                    const response = await axios.get('/api/cmpathinfo');
                    window.location.href = response.data.home_url;
                }else{
                    this.sweetalert('작업중 오류가 발생하였습니다.', body, 'error', '닫기');            
                }  
            } catch (error) {
                this.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기');
            }
        }//user info insert
    };

    //로그 저장
    saveLogMessage = (log_cd, log_contents) => {
        axios.post('/api/system?type=log', {
            is_Log_cd : log_cd,
            is_Log_contents : log_contents,
            is_Reg_usernm : 'signup',
            is_Reg_user : 'signup',
        })
        .then( response => {
        })
        .catch( response => {this.sweetalert('작업중 오류가 발생하였습니다.', response, 'error', '닫기')} ); 
    }

    //알림 메시지 전송
    sendNoticeMessage = (receiver, message, e) => {
        axios.post('/api/message?type=push', {
            is_Receiver : receiver,
            is_Message : message,
            is_Pjtcode : '',
        })
        .then( response => {
        })
        .catch( error => {this.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기')} ); 
    }

    //관리자에게 사용자 승인요청 메일 발송
    sendEmail = (email, subject, text, e) => {

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
                    .catch( error => {this.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기'); return false;});
                }
            }
        })
        .catch( error => {this.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기'); return false;});

    }

    //로그아웃
    logout = async (e) => {
        cookie.remove('userid', { path: '/'});
        cookie.remove('username', { path: '/'});
        cookie.remove('user_flag', { path: '/'});
        cookie.remove('userpassword', { path: '/'});
    }

    // 이메일 keypress
    emailKeyPress = (e) => {
        $('#email_val').removeClass('border_validate_err');
    };

    // 비밀번호 keypress
    pwdKeyPress = (e) => {
        $('#pwd_val').removeClass('border_validate_err');
    };

    // 비밀번호 확인 keypress
    pwdCnfKeyPress = (e) => {
        $('#pwd_cnf_val').removeClass('border_validate_err');
    };

    // 이름 keypress
    nameKeyPress = (e) => {
        $('#name_val').removeClass('border_validate_err');
    };

    // 회원가입 정보 submit
    handleSubmit = (e) => {
        e.preventDefault();
    };
    
    //휴대전화 숫자만 강제입력
    mustNumber = (id) => {
        var pattern1 = /[0-9]/;	// 숫자
        var str = $('#'+id).val();
        //가장 최근에 입력한 string이 숫자가 아니면 삭제처리
        if(!pattern1.test(str.substr(str.length - 1, 1))){
            $('#'+id).val(str.substr(0, str.length-1));
        }
    }

    // 이메일 선택입력
    email2_change = (e) => {
        if(e.target.value == 1){
            $('.email2_class').attr('disabled', false);
            $('#drct_tr').show()
        }else{
            $('.email2_class').attr('disabled', true);
            $('#drct_tr').hide()
            this.state.email2_val_selected = $('#email2_val').val()
            $('#is_Useremail2').val(this.state.email2_val_selected)
            
        }
    }
    
    //이메일 직접입력
    drct_email2_change = (e) => {
        this.state.email2_val_selected = $('#drct_email2_val').val()
        $('#is_Useremail2').val(this.state.email2_val_selected)
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
            <div>
                <section className="sub_wrap" >
                    <article className="s_cnt re_1 ct1">
                        <div className="li_top">
                            <h2 className="s_tit1">회원가입&middot;나의 정보 수정</h2>
                            <form method="post" name="frm" action="">
                            <input type="hidden" id="is_Useremail2" name="is_Useremail2"/>
                                <div className="re1_wrap">
                                    <div className="re_cnt ct2">
                                        <table className="table_ty1">
                                            <tr className="re_email">
                                                <th>이메일</th>
                                                <td>
                                                    <input id="email_val" type="text" name="is_Useremail1" placeholder="이메일을 입력해주세요." onKeyPress={this.emailKeyPress}/>
                                                    <span className="e_goll">@</span>
                                                    <select id="email2_val" name="" className="select_ty1" onChange={e => this.email2_change(e)}>
                                                            <option value="">선택하세요</option>
                                                            <option value="1">직접입력</option>
                                                            <option value='naver.com'>naver.com</option>
                                                            <option value='hanmail.net'>hanmail.net</option>
                                                            <option value='nate.com'>nate.com</option>
                                                            <option value='hotmail.com'>hotmail.com</option>
                                                            <option value='gmail.com'>gmail.com</option>>
                                                            <option value='yahoo.co.kr'>yahoo.co.kr</option>
                                                            <option value='yahoo.com'>yahoo.com</option>
                                                    </select>
                                                </td>
                                            </tr>
                                            <tr id="drct_tr">
                                                <th>이메일 직접입력</th>
                                                <td>
                                                    <input id="drct_email2_val" className="email2_class" type="text" name="" placeholder="naver.com" onChange={e => this.drct_email2_change(e)} disabled/>
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>비밀번호</th>
                                                <td>
                                                    <input id="pwd_val" type="password" name="is_Password" placeholder="비밀번호를 입력해주세요." onKeyPress={this.pwdKeyPress} />
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>비밀번호 확인</th>
                                                <td>
                                                    <input id="pwd_cnf_val" type="password" name="is_Password" placeholder="비밀번호를 다시 입력해주세요." onKeyPress={this.pwdCnfKeyPress}/>
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>성명</th>
                                                <td>
                                                    <input id="name_val" type="text" name="is_Username" placeholder="성명을 입력해주세요." onKeyPress={this.nameKeyPress}/>
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>소속 기관</th>
                                                <td>
                                                    <input id="org_val" type="text" name="is_Organization" placeholder="소속 기관명을 입력해주세요." />
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>전공</th>
                                                <td>
                                                    <input id="major_val" type="text" name="is_Usermajor" placeholder="전공을 입력해주세요." />
                                                </td>
                                            </tr>
                                            <tr className="tr_tel">
                                                <th>핸드폰</th>
                                                <td>
                                                    <select id="phone1_val" name="is_Userphone1" className="select_ty1">
                                                        <option value="">선택</option>
                                                        <option value="010">010</option>
                                                        <option value="011">011</option>
                                                        <option value="016">016</option>
                                                        <option value="017">017</option>
                                                        <option value="018">018</option>
                                                        <option value="019">019</option>
                                                    </select>
                                                    <span className="tel_dot">-</span>
                                                    <input id="phone2_val" name="is_Userphone2" max="9999" maxlength="4" onChange={(e) => this.mustNumber("phone2_val")}/>
                                                    <span className="tel_dot">-</span>
                                                    <input id="phone3_val" name="is_Userphone3" max="9999" maxlength="4" onChange={(e) => this.mustNumber("phone3_val")}/>
                                                </td>
                                            </tr>
                                        </table>
                                    </div>
                                </div>
                                <div className="btn_confirm">
                                {
                                !(cookie.load('userid') === undefined) ?
                                <div className="bt_ty bt_ty1 cancel_ty1" type="" onClick={(e) => this.submitClick('modify', e)}>수정</div>
                                : <div className="bt_ty bt_ty2 submit_ty1" type="" onClick={(e) => this.submitClick('signup', e)}>회원가입</div>
                                }  
                                </div>
                            </form>
                        </div>
                    </article>
                </section>
            </div>
        );
    }
}

export default Register;