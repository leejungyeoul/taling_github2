import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import cookie from 'react-cookies';
import 'react-app-polyfill/ie11';
import axios from "axios";
import Swal from 'sweetalert2'
import $ from 'jquery';

class Header extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            responseNotice: '',    //subcode response 변수
            append_NoticeFld: '',   //연구분야 append 변수
            notice_cnt: '',   //알림 갯수
            //세션 처리
            usernm:'', //사용자 이름
            userid:'', //사용자 아이디
        };

        this.temp_ref = () => {
            $(this).css('display', 'block');
        }
    }

    componentDidMount() {
        var cookie_userid = cookie.load('userid')
        var cookie_username = cookie.load('username')

        //사용자가 페이지 로드를 한 시점부터 다시 세션시간 계산
        if(cookie_userid != undefined && cookie_username != undefined){
            const expires = new Date()
            expires.setMinutes(expires.getMinutes() + 60)
            cookie.save('userid', cookie_userid
                , {
                    path: '/',
                    expires
                }
            );
            cookie.save('username', cookie_username
                , {
                    path: '/',
                    expires
                }
            );
            cookie.save('user_flag', 'Y'
                , {
                    path: '/',
                    expires
                }
            );
            $('.menulist').show()
        }else{
            $('.menulist').hide()
        }
        this.callSessionInfoApi()

        $("body").click(function(){
            $(".hd_left > li > .box0").stop().fadeOut(200);
        });

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
            this.callNoticeApi('none')
        })
        .catch( error => {this.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기');return false;} );
    }

    // 커뮤니티 탭 드롭다운 이벤트
    mouseEnter () {
        $('.gn_2').stop().slideDown(300);
    };

    // 커뮤니티 탭 드롭다운 이벤트
    mouseLeave () {
        $('.gn_2').stop().slideUp(300);
    };

    // 내 정보 영역 마우스 hover 이벤트
    myInfoHover () {
        $(".hd_left > li > .box1").stop().fadeIn(400);
    }
    
    // 내 정보 영역 마우스 hover 이벤트
    myInfoLeave () {
        $(".hd_left > li > .box1").stop().fadeOut(400);
    }
    
    // 알림 영역 마우스 hover 이벤트
    alarmHover = (e) => {
        this.callNoticeApi('display')
    }

    // 알림 영역 마우스 leave 이벤트
    alarmLeave () {
        $(".hd_left > li > .box0").stop().fadeOut(200);
    }
    //로그아웃 아이디 세션 정보 삭제
    logout = async e => {
        cookie.remove('userid', { path: '/'});
        cookie.remove('username', { path: '/'});
        cookie.remove('user_flag', { path: '/'});
        cookie.remove('userpassword', { path: '/'});

        const response = await axios.get('/api/cmpathinfo');
        window.location.href = response.data.home_url;
    }

    // 알림 메시지 호출
    callNoticeApi = (type) => {
        try {
            var userid = ''
            userid = this.state.userid
            
            if(userid != '' && userid != undefined){
                axios.post('/api/message?type=push_list', {
                    is_Email : userid
                })
                .then( response => {
                    this.setState({ responseNotice: response });
                    this.setState({ append_NoticeFld: this.NoticeAppend(type) });
                })
                .catch( error => {this.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기');return false;} );
            }
        } catch (error) {
            this.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기')
        }
    }

    // // 알림 메시지 리스트
    NoticeAppend = (type) => {
        let result = []
        var NoticeList = this.state.responseNotice.data
        const size = NoticeList.json.length
        this.state.notice_cnt = '('+size+')'
        if(size == 0){
        }else{
            if(type == 'display'){
                $(".hd_left > li > .box0").stop().fadeIn(200);
            }
        }
    
        for(let i=0; i<size; i++){
            var message = NoticeList.json[i].notice_message;
            var notice_code = NoticeList.json[i].notice_code;
            var date = NoticeList.json[i].reg_date;

            var year = date.substr(0,4)
            var month = date.substr(4,2)
            var day = date.substr(6,2)
            var hour = date.substr(8,2)
            var min = date.substr(10,2)
            date = year  +'.'+month+'.'+day+'  '+hour+':'+min

            result.push(
                <li>
                    <a href="javascript:" className='Notice' id={notice_code} onClick={(e) => this.deleteNotice(e)} >
                        <p className="txt_ty1" id={notice_code}>
                            {message}
                        </p>
                        <span className="txt_ty1">{date}</span>
                    </a>
                </li>
            )
        }
        return result
    }
    
    // 알림 메시지 읽음 처리
    deleteNotice = (e) => {
        var notice_code =  e.target.getAttribute('id')

        try {
            axios.post('/api/message?type=push_read', {
                is_Notice_code : notice_code
            })
            .then( response => {
                this.alarmLeave()
                this.callNoticeApi('none')
            })
            .catch( response => {return false;} );
        } catch (error) {
            this.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기')
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
        return(
            <header className="gnb_box">
                {
                    (cookie.load('userid') === undefined) ?
                    console.log('logining') :
                    <div className="hd_top">
                        <div className="top_wrap ct1 af">
                        <ul className="hd_left af">
                            <li className="my1" onMouseEnter={this.myInfoHover} onMouseLeave={this.myInfoLeave}><b>내정보</b>
                            <div className="box0 box1">
                                <ul>
                                <li><Link to={'/register'}>내 정보 수정</Link></li>
                                <li><a href="javascript:" onClick={this.logout}>로그아웃</a></li>
                                </ul>
                            </div>
                            </li>
                            <li  className="my2" onMouseEnter={this.alarmHover} onMouseLeave={this.alarmLeave}><b><span>{this.state.notice_cnt}</span>알림</b>
                            <div className="box0 box2">
                                <ul className="al_box">
                                    {this.state.append_NoticeFld}
                                </ul>	
                                <span className="bt_ty1">
                                <a href="javascript:" onClick={this.deleteNotice}>알림 모두 제거</a>
                                </span>
                            </div>
                            </li>
                        </ul>
                        <div className="hd_right">
                            <p><span>'{this.state.usernm}'</span>님 반갑습니다.</p>
                        </div>
                        </div>
                    </div>
                }
                <div className="h_nav ct1 af">
                    <div className="logo">
                        <Link to={'/'}></Link>
                    </div>
                    <nav className="gnb">
                    {/* <span className="sitemap" onClick={this.sitemapClick}>
                        <a href="#n"><img src={require('../img/layout/sitemap.png')} alt="t" /></a>
                    </span> */}
                    <ul className="af">
                        <li className="menulist">
                            <Link to={'/rsc-pjs'}>Research Projects</Link>
                        </li>
                        <li className="menulist">
                            <Link to={'/sw-list'}>Software Tools</Link>
                        </li>
                        <li className="menulist">
                            <Link to={'/data-src-list'}>Data Sources</Link>
                        </li>
                        {/* 드롭다운 이벤트 */}
                        <li onMouseEnter={this.mouseEnter} onMouseLeave={this.mouseLeave} ><Link to={'/community/notice'}>Community</Link>
                        <ul className="gn_2">
                            <li><Link to={'/community/notice'}>공지사항</Link></li>
                        </ul>
                        </li>
                    </ul>
                    </nav>
                </div>
            </header>
        );
    }
}


export default Header;