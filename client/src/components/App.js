import 'react-app-polyfill/ie11';
import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import { Router, Route, Switch } from "react-router";
import cookie from 'react-cookies';
import { Redirect } from 'react-router-dom'
import { RouteComponentProps } from 'react-router-dom'
import axios from "axios";

// css
import '../css/new.css';
import '../css/owl.carousel.min.css';
import '../css/owl.theme.default.min.css';
import '../css/fixed.css';
import '../css/event.css';

// component
import Header from './Header/Header';
import HeaderAdmin from './Header/Header admin';
import Footer from './Footer/Footer';

// login
import LoginForm from './LoginForm';
import PwChangeForm from './PwChangeForm';

// popup
import Popup from './Popup';

// register
import Register from './Register/Register';
import RegisterCheck from './Register/RegisterCheck';

// my projects
import MyProjectDetail from './MyProjects/MyProjectCoRsc';
import MyProjectWrite from './MyProjects/MyProjectWrite';
import MyProject_sitepop from './MyProjects/MyProject_sitepop';


// research projects
import ResearchProject from './ResearchProjects/ResearchProject';

// software tools
import SoftwareList from './SoftwareTools/SoftwareList'
import SoftwareView from './SoftwareTools/SoftwareView'

// data sources
import DataSourceList from './DataSources/DataSourceList';
import DataSiteMap from './DataSources/DataSiteMap';
import DataSourceView from './DataSources/DataSourceView';

// notice
import Notice from './Community/Notice/Notice';
import NoticeView from './Community/Notice/NoticeView';
import NoticeWrite from "./Community/Notice/NoticeWrite";
import NoticeModify from "./Community/Notice/NoticeModify";

// ADMIN
import UserApproval from './UserManage/UserApproval';
import AdminResearchProject from './ProjectManage/AdminResearchProject';
import AdminMyProjectDetail from './ProjectManage/AdminMyProjectCoRsc';

import AdminSoftwareList from './SoftwareToolsManage/AdminSoftwareList';
import AdminSoftwareView from './SoftwareToolsManage/AdminSoftwareView';
import AdminDataSourceList from './DataSourcesManage/AdminDataSourceList';
import AdminDataSourceView from './DataSourcesManage/AdminDataSourceView';
import SubCodeManage from './SubCodeManage/SubCodeManageView';

class App extends Component {
  constructor (props) {
    super(props);
    
    this.state = {
        //세션 처리
        usernm:'', //사용자 이름
        userid:'', //사용자 아이디
    }
}

  componentDidMount() {
    
      // 비밀번호 재설정 패이지를 제외하고, 세션이 유효하지 않으면 home url로 이동.
      if(window.location.pathname.indexOf('/PwChangeForm') == -1){

        var home_url = ''
        axios.get('/api/cmpathinfo')
        .then(function (response) {
          home_url = response.data.home_url;
        })   
        
        //쿠키에서 userid, username을 가져와 복호화한다.
        axios.post('/api/LoginForm?type=SessionConfirm', {
          token1 : cookie.load('userid') 
          , token2 : cookie.load('username') 
        })
        .then( response => {
            this.state.userid = response.data.token1
            let password = cookie.load('userpassword')
            if(password == undefined){
              password = ''
            }
            axios.post('/api/LoginForm?type=pwemail', {
              is_Email: this.state.userid,
              is_Token : password
            })
            .then( response => {
              if(response.data.json[0] !== undefined){
                var userid = response.data.json[0].useremail
                var userflag = response.data.json[0].userflag
                  
                if(userid == undefined || password == undefined){
                  if(userflag == 'M'){
                    //관리자인경우 admin home url 호출
                    window.location.href = home_url + '/admin';
                  }else if(userflag == 'Y'){
                    //사용자인경우 home url 호출
                    window.location.href = home_url;
                  }
                }
              }else{
                // 계정정보가 유효하지 않다면 세션값 삭제후, 홈으로 이동
                if(window.location.hash != 'nocookie'){
                  this.remove_cookie()
                  window.location.href = home_url+'/nocookie/#nocookie'
                }
              }
            })
            .catch( response => {
              this.remove_cookie()
              window.location.href = home_url+'/nocookie/#nocookie';
              return false;
            } );
        })
        .catch( response => {window.location.href = home_url+'/nocookie/#nocookie';return false;} );
      }
  }

  //쿠키 초기화
  remove_cookie = (e) => {
    cookie.remove('userid', { path: '/'});
    cookie.remove('username', { path: '/'});
    cookie.remove('user_flag', { path: '/'});
    cookie.remove('userpassword', { path: '/'});
  }

  render () {
    return (
      <div className="App">
            {
              (cookie.load('user_flag') === 'M') ?
              <HeaderAdmin/> : // admin 로그인일 경우
              <Header/>// front 로그인일 경우
            }
          
          <Switch>
            {/* 프론트 */}
            <Route path='/PwChangeForm/:email/:token' component={PwChangeForm} />
            
            {
              (cookie.load('userid') !== undefined) ? (
                (cookie.load('user_flag') === 'Y') ?
                <Route exact path='/' component={ResearchProject} /> : // 로그인 하지 않았을 경우
                <Route exact path='/admin' component={UserApproval} /> // 로그인 했을 경우
              ):(
                  (cookie.load('user_flag') === 'Y') ?
                  <Route exact path='/' component={LoginForm} /> : // 로그인 하지 않았을 경우
                  <Route exact path='/admin' component={LoginForm} /> // 로그인 했을 경우
              )
            }

            {
              (cookie.load('userid') === undefined && cookie.load('user_flag') === undefined) ? (
                <Route exact path='/' component={LoginForm} />
              ):''
            }

            <Route path='/nocookie' component={LoginForm} />
            <Route path='/register' component={Register} />
            <Route path='/register_check' component={RegisterCheck} />

            <Route path='/my-pjd/:pjtcode' component={MyProjectDetail} />
            <Route path='/my-pjw/:pjtcode/:flag' component={MyProjectWrite} />
            <Route path='/MyProject_sitepop/:pjtcode/:swt_code' component={MyProject_sitepop} />

            <Route path='/rsc-pjs' component={ResearchProject} />

            <Route path='/sw-list' component={SoftwareList} />
            <Route path='/sw-view/:swtcode' component={SoftwareView} />

            <Route path='/data-src-list' component={DataSourceList} />
            <Route path='/data-site-map' component={DataSiteMap} />
            <Route path='/data-src-view/:dscode' component={DataSourceView} />

            <Route path='/community/notice' component={Notice} />
            <Route path='/community/notice-view/' component={NoticeView} />
            <Route path="/community/notice/write/:flag" component={NoticeWrite} />
            <Route path="/community/noticeModify/:flag" component={NoticeModify} />

            {/* admin */}
            <Route path='/UserApproval' component={UserApproval} />
            <Route path='/AdminResearchProject' component={AdminResearchProject} />
            <Route path='/admin-my-pjw/:pjtcode' component={AdminMyProjectDetail} />

            <Route path='/AdminSoftwareList' component={AdminSoftwareList} />
            <Route path='/AdminSoftwareView/:swtcode' component={AdminSoftwareView} />
            <Route path='/AdminDataSourceList' component={AdminDataSourceList} />
            <Route path='/AdminDataSourceView/:dscode' component={AdminDataSourceView} />
            <Route path='/SubCodeManage' component={SubCodeManage} />

          </Switch>

          <Popup />

          <Footer 
            footer_address={this.props.footer_address} 
            footer_tel={this.props.footer_tel}  
            footer_email={this.props.footer_email} 
            footer_mobile={this.props.footer_mobile} 
          />
          
      </div>
    );
  }
}

App.defaultProps = {
  // footer value
  footer_address: '[16499] 경기도 수원시 영통구 월드컵로 164 홍재관 503호',
  footer_tel: '031-219-4471',
  footer_email: 'appledrinker@naver.com',
  footer_mobile: '010-9566-5125',
  isLogin: false,  // 로그인 상태체크 변수, 세션 need
};

export default App;
