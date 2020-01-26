import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import cookie from 'react-cookies';
import $ from 'jquery';
import axios from "axios";
import Swal from 'sweetalert2'

class LoginForm extends Component {

    state = {
    }

    submitClick = async e => {
        this.email_val = $('#email_val').val();
        this.pwd_val = $('#pwd_val').val();
        if(this.email_val === '' || this.pwd_val === ''){
            this.sweetalert('이메일과 비밀번호를 확인해주세요.', '', 'info', '닫기')
        }else{
            axios.post('/api/LoginForm?type=signin', {
                is_Email: this.email_val,
                is_Password: this.pwd_val
            })
            .then( response => {
                try {
                    var userid = response.data.json[0].useremail
                    var username = response.data.json[0].username
                    var userflag = response.data.json[0].userflag
                    var upw = response.data.json[0].userpassword

                    if(userflag == 'N'){
                        this.sweetalert('승인대기중 계정입니다.', '', 'info', '닫기')
                        return false
                    }else if(userflag == 'D'){
                        this.sweetalert('관리자가 반려한 계정입니다.', '', 'info', '닫기')
                        return false
                    }

                    if(userid != null && userid != ''){
                        this.sweetalert('로그인 되었습니다.', '', 'info', '닫기')
                        //로그인 id 세션에 저장
                        const expires = new Date()
                        expires.setMinutes(expires.getMinutes() + 60)

                        //userid 와 username을 비밀키로 암호화해 쿠키값에 세팅한다.
                        axios.post('/api/LoginForm?type=SessionState', {
                            is_Email: userid,
                            is_UserName: username,
                        })
                        .then( response => {

                            cookie.save('userid', response.data.token1
                            , {
                                path: '/',
                                expires,
                                // httpOnly: true // 도메인 연결 후 주석해제
                            })

                            cookie.save('username', response.data.token2
                            , {
                                path: '/',
                                expires,
                                // httpOnly: true // 도메인 연결 후 주석해제
                            })

                            cookie.save('userpassword', upw
                            , {
                                path: '/',
                                expires,
                                // httpOnly: true // 도메인 연결 후 주석해제
                            })
                            
                        })  
                        .catch( error => {this.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기'); return false; } );

                        //관리자인경우
                        if(userflag == 'M'){
                            cookie.save('user_flag', 'M'
                                , {
                                    path: '/',
                                    expires
                                }
                            );
                            //home url 호출
                            axios.get('/api/cmpathinfo')
                            .then(function (response) {
                                window.location.href = response.data.home_url+'/admin';
                            })                
                        //사용자인경우            
                        }else if(userflag == 'Y'){
                            cookie.save('user_flag', 'Y'
                                , {
                                    path: '/',
                                    expires
                                }
                            );
                            //home url 호출
                            axios.get('/api/cmpathinfo')
                            .then(function (response) {
                                window.location.href = response.data.home_url;
                            })
                        }

                    }else{
                        this.sweetalert('이메일과 비밀번호를 확인해주세요.', '', 'info', '닫기')
                    }
                } catch (error) {
                    this.sweetalert('이메일과 비밀번호를 확인해주세요.', '', 'info', '닫기')
                }
            })
            .catch( response => { return false; } );
        }
    }

    // input value state
    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    // login form post
    handleSubmit = (e) => {
        e.preventDefault();
        const data = {
            user_email: e.target.email.value,
            user_pwd: e.target.password.value
        }
    }

    // 비밀번호 재설정
    pwdResetClick = () => {
        $('.m_login').hide();
        $('.m_pw').fadeIn();
        $('.m_pw').css('display','table-cell');
    }

    // 비밀번호 재설정 취소
    pwdResetCancleClick = () => {
        $('.m_login').fadeIn();
        $('.m_pw').hide();
        $('.m_login').css('display','table-call');
        $('.m_pw').css('display','none');
    }

    //비밀전호 재설정용 메일 발송
    sendEmail = (email, subject, text, e) => {
        axios.post('/api/message?type=email&roll=resetpw', {
            is_Email : email,
            is_Subject : subject,
            is_Text: text
        })
        .then( response => {
            this.sweetalert('입력하신 이메일로 비밀번호 \n 재설정 메일 보내드렸습니다.', '', 'info', '닫기')
        })
        .catch( error => {this.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기');return false;});
    }

    // //비밀번호 재설정 확인버튼
    pwdResetConfim = (e) => {
        this.reset_email = $('#reset_email_val').val();
        this.reset_name = $('#reset_name_val').val();
        if(this.reset_email === '' || this.reset_name === ''){
            this.sweetalert('이메일과 성명을 확인해주세요.', '', 'info', '닫기')
        }else{
            axios.post('/api/LoginForm?type=pwreset', {
                is_Email: this.reset_email,
                is_Name: this.reset_name,
            })
            .then( response => {
                var userid = response.data.json[0].useremail
                var username = response.data.json[0].username
                var userpassword = response.data.json[0].userpassword

                if(userid != null && userid != ''){
                    this.sendEmail(userid, 'rtrod 비밀번호 재설정 메일', userpassword)
                }else{
                    this.sweetalert('이메일과 성명을 확인해주세요.', '', 'info', '닫기')
                }
            })
            .catch( response => {this.sweetalert('이메일과 성명을 확인해주세요.', '', 'info', '닫기');return false; } );
        }
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
            <section className="main">
            {/* <!-- 로그인폼 --> */}
                <div className="m_login">
                <h3><span><img src={require("../img/main/log_img.png")} alt="" /></span>LOGIN</h3>
                <div className="log_box">
                    <form onSubmit={this.handleSubmit}>
                    <div className="in_ty1">
                        <span><img src={require("../img/main/m_log_i3.png")} alt="" /></span>
                        <input type="text" id="email_val" name="email" placeholder="이메일" onChange={this.handleChange} />
                    </div>
                    <div  className="in_ty1">
                        <span className="ic_2"><img src={require("../img/main/m_log_i2.png")} alt="" /></span>
                        <input type="password" id="pwd_val" name="password" placeholder="비밀번호" onChange={this.handleChange} />
                    </div>
                    <ul className="af">
                        <li><Link to={'/register_check'}>회원가입</Link></li>
                        <li className="pwr_b" onClick={this.pwdResetClick}><div className='pwd_reset_txt'>비밀번호 재설정</div></li>
                    </ul>
                    {/* <input className="s_bt" type="submit" value="로그인" />	 */}
                    <button className="s_bt" type="submit" onClick={this.submitClick}>로그인</button>
                    </form>
                </div>
                </div>
            {/* <!-- 비밀번호 재설정 --> */}
                <div className="m_login m_pw">
                <h3 className="pw_ls">비밀번호 재설정 <span className="compl1">완료</span></h3>
                <div className="log_box">
            {/* <!-- 1단 --> */}
                    {/* <form method="post"> */}
                    <div className="pw_one">
                        <div className="in_ty1">
                        <span><img src={require("../img/main/m_log_i3.png")} alt="" /></span>
                        <input type="text" id="reset_email_val" name="" placeholder="이메일"/>
                        </div>
                        <div  className="in_ty1">
                        <span className=""><img src={require("../img/main/m_log_i1.png")} alt="" /></span>
                        <input type="text" id="reset_name_val" name="" placeholder="성명"/>
                        </div>
                        <div className="btn_confirm btn_confirm_m">
                        <div className="bt_ty bt_ty_m bt_ty1 cancel_ty1" onClick={this.pwdResetCancleClick}>취소</div>
                        <a href="#n" className="bt_ty bt_ty_m bt_ty2 submit_ty1" onClick={this.pwdResetConfim}>확인</a>
                        </div>
                    </div>
            {/* <!-- 2단 가려둠-->  */}
                    <div className="pw_two">
                        <div className="in_ty1">
                        <span className="ic_2"><img src={require("../img/main/m_log_i2.png")} alt="" /></span>
                        <input type="password" name="" placeholder="새 비밀번호" />
                        </div>
                        <div className="in_ty1">
                        <span className="ic_2"><img src={require("../img/main/m_log_i2.png")} alt="" /></span>
                        <input type="password" name="" placeholder="새 비밀번호 확인" />
                        </div>
                        <div className="btn_confirm btn_confirm_m">
                        <div className="bt_ty bt_ty_m bt_ty1 cancel_ty1">취소</div>
                        <a href="#n" className="bt_ty bt_ty_m bt_ty2 submit_ty1">재설정</a>
                        </div>
                    </div>
            {/* <!-- 3단 가려둠 --> */}
                    <div className="pw_tree">
                        <div className="">
                        <p>
                            '<span>홍길동</span>'
                            님의 비밀번호가 재설정되었습니다.
                        </p>		
                        
                        </div>
                        <input className="s_bt" type="submit" value="로그인 이동" />	
                    </div>
                    {/* </form> */}
                </div>
                </div>
                
            </section>
        );
    }
}

LoginForm.defaultProps = {
}

export default LoginForm;