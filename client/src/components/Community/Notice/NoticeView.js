import axios from "axios";
import React, { Component } from "react";
import $ from "jquery";
import { Link } from "react-router-dom";
import cookie from "react-cookies";

class NoticeView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      res_notice: "",
      append_noticeInfo: "",

      noticeCode: props.match.params.ntcd
    };
  }

  componentDidMount() {
    //관리자 확인
    var cookie_admin = cookie.load("user_flag");
    if (cookie_admin === "M") {
      $(".notice_modify").show();
    } else {
      $(".notice_modify").hide();
    }
    this.callNoticeSource(this.state.noticeCode);
  }

  //Noticedata 호출해와서 id 받기
  callNoticeSource = async noticeCode => {
    // alert(noticeCode);
    axios
      .post("/api/Notice?type=detail", {
        is_Notice_code: noticeCode
      })
      .then(res => {
        try {
          this.setState({ res_notice: res });
          this.setState({ append_noticeInfo: this.appendNoticeInfo() });
        } catch (err) {
          alert("으앙" + err);
        }
      })
      .catch(res => {
        // alert("2");
        return false;
      });
  };

  // 작성자 작성일 조회 append
  appendNoticeInfo = () => {
    let result = [];
    var NoticeData = this.state.res_notice.data;

    result.push(
      <React.Fragment>
        <div className="bo_view">
          <header>
            <h1 id="bo_v_title">{NoticeData.json[0].nt_title}</h1>
          </header>
          <section id="bo_v_info">
            <h2>페이지 정보</h2>
            <ul>
              <li>
                작성자 : <strong>{NoticeData.json[0].reg_user}</strong>
              </li>
              <li>
                작성일 : <strong>{NoticeData.json[0].reg_date}</strong>
              </li>
              <li>
                조회 : <strong>{NoticeData.json[0].nt_view}</strong>
              </li>
            </ul>
          </section>
        </div>
        <div>
          <div id="bo_v_atc">
            <br></br>
            <p style={{ "font-size": "16px" }}>
              {NoticeData.json[0].nt_description}
            </p>
          </div>
        </div>
      </React.Fragment>
    );

    return result;
  };

  //===================================
  render() {
    return (
      <section className="sub_wrap">
        <article className="s_cnt mp_pro_li ct1">
          <div className="li_top">
            <h2 className="s_tit1">공지사항 상세보기</h2>
          </div>
          {this.state.append_noticeInfo}
          <div id="bo_v_top">
            <ul className="bo_v_nb">
              <li>
                <a href="" className="">
                  이전글
                </a>
              </li>
              <li>
                <a href="" className="">
                  다음글
                </a>
              </li>
            </ul>
            <ul className="bo_v_com">
              <li>
                <Link to={"/community/notice"} className="">
                  목록
                </Link>
              </li>
              <li className="notice_modify">
                <Link to={"/community/notice/modify"} className="">
                  수정
                </Link>
              </li>
            </ul>
          </div>
        </article>
      </section>
    );
  }
}

export default NoticeView;
