import React, { Component } from "react";
import { Link } from "react-router-dom";
import $ from "jquery";
import axios from "axios";
import cookie from "react-cookies";

class Notice extends Component {
  constructor(props) {
    super(props);

    this.state = {
      response_notice: "", //notice 리스트 response 변수
      append_notice: "", //notice 리스트 append 변수

      total: "",
      blockdetail: "",

      flag: props.match.params.flag
    };
  }

  // react- router - module - dbcnnectmodule - mapper - react

  componentDidMount() {
    //관리자 확인
    var cookie_admin = cookie.load("user_flag");
    if (cookie_admin === "M") {
      $(".notice_write").show();
    } else {
      $(".notice_write").hide();
    }

    this.callNoticeListApi();
  }

  //공지 리스트 호출

  callNoticeListApi = async () => {
    //List 호출
    axios
      .post("/api/Notice?type=list")
      .then(response => {
        try {
          this.setState({ response_notice: response });
          this.setState({ append_notice: this.NoticeAppend() });
        } catch (error) {
          alert("작업 중 오류가 발생하였습니다. " + error);
        }
      })
      .catch(response => {
        return false;
      });
  };

  // 공지리스트 append (수정중)
  NoticeAppend = () => {
    let result = [];
    var NoticeData = this.state.response_notice.data;

    for (let i = 0; i < NoticeData.json.length; i++) {
      var notice_code = NoticeData.json[i].nt_cd;
      var detail_url = `/community/noticeView/` + notice_code;

      var style = { display: "" };
      var rawdate = NoticeData.json[i].reg_date;
      var year = rawdate.substr(0, 4);
      var month = rawdate.substr(4, 2);
      var day = rawdate.substr(6, 2);
      var date = year + "." + month + "." + day;

      result.push(
        <div className="div_list">
          <div class="div_td col_num">{NoticeData.json[i].nt_view}</div>
          {/* {글번호는 페이징 이후 새로 생성}} */}
          <div class="div_td col_subject">
            <Link to={detail_url} id={i} onClick={e => this.goDetail(i, e)}>
              {/* <!-- 신규글은 span 생성 --> */}
              <h4>
                {NoticeData.json[i].nt_title}
                <span className="col_subject" style={style}>
                  new!
                </span>
              </h4>
            </Link>
          </div>
          <div class="div_td col_writer">{NoticeData.json[i].reg_user}</div>
          <div class="div_td col_date">{date}</div>
          <div class="div_td col_hit">{NoticeData.json[i].nt_view}</div>
        </div>
      );
    }
    return result;
  };

  goDetail = (i, e) => {
    if (this.state.blockdetail.indexOf(i) > -1) {
      alert("으앙");
    }
  };

  //===============================================================
  render() {
    return (
      <section className="sub_wrap">
        <article className="s_cnt mp_pro_li ct1">
          <div className="li_top">
            <h2 className="s_tit1">공지사항 목록</h2>
          </div>

          <div className="bo_list">
            <div className="bo_fx">
              <div id="bo_list_total">
                <span>
                  Total {this.state.total_size} 건 중{this.state.nowPage}
                  페이지{" "}
                </span>
              </div>
            </div>

            <form name="fboardlist" id="fboardlist" method="post">
              <div className="tb_outline">
                <div className="div_tb">
                  <div className="div_tb_tr">
                    <div className="div_th col_num">번호</div>
                    <div className="div_th col_subject">제목</div>
                    <div className="div_th col_writer">글쓴이</div>
                    <div className="div_th col_date">날짜</div>
                    <div className="div_th col_hit">조회</div>
                  </div>
                </div>

                <div className="div_tb">
                  <div className="div_tb_tr">{this.state.append_notice}</div>
                </div>
              </div>
            </form>
            <div className="sch_wra">
              <fieldset id="bo_sch">
                <legend>게시물 검색</legend>
                <form name="" method="get">
                  <input
                    type="hidden"
                    name=""
                    value=""
                    onChange={this.handleChange}
                  />
                  <input
                    type="hidden"
                    name=""
                    value=""
                    onChange={this.handleChange}
                  />
                  <input
                    type="hidden"
                    name=""
                    value=""
                    onChange={this.handleChange}
                  />
                  <select name="">
                    <option value="">제목</option>
                    <option value="">내용</option>
                    <option value="">제목+내용</option>
                  </select>
                  <input
                    type="text"
                    name=""
                    value=""
                    placeholder="검색어(필수)"
                    required
                    id=""
                    className="required frm_input"
                    onChange={this.handleChange}
                  />
                  <input type="submit" value="검색" className="btn_submit" />
                  <ul className="notice_write">
                    <li>
                      <Link to={"/community/notice_write"} className="">
                        작성
                      </Link>
                    </li>
                  </ul>
                </form>
              </fieldset>
            </div>
          </div>
          <div className="list_cont">
            <table className="table_ty2">
              <tbody>{this.state.append_PjtList}</tbody>
            </table>
            <div className="page_ty1">{this.state.append_paging}</div>
          </div>
        </article>
      </section>
    );
  }
}

export default Notice;
