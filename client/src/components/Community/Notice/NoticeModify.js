import axios from "axios";
import React, { Component } from "react";
import $ from "jquery";
import { Link } from "react-router-dom";
import cookie from "react-cookies";

import "codemirror/lib/codemirror.css";
import "tui-editor/dist/tui-editor.min.css";
import "tui-editor/dist/tui-editor-contents.min.css";
import { Editor } from "@toast-ui/react-editor";

import "tui-color-picker/dist/tui-color-picker.min";
import "tui-editor/dist/tui-editor-extColorSyntax";
import "codemirror/lib/codemirror.css";
import "tui-editor/dist/tui-editor.css";
import "tui-editor/dist/tui-editor-contents.css";
import "highlight.js/styles/github.css";
import "tui-color-picker/dist/tui-color-picker.min.css";

class NoticeModify extends Component {
  constructor(props) {
    super(props);

    this.state = {
      append_editor: ""
    };
  }

  componentDidMount() {
    this.NoticeEditor();
    this.setState({ append_editor: this.NoticeEditor() });
  }

  NoticeEditor = () => (
    <Editor
      initialValue="hello react editor world!"
      previewStyle="vertical"
      height="600px"
      initialEditType="markdown"
      useCommandShortcut={true}
      exts={[
        {
          name: "chart",
          minWidth: 100,
          maxWidth: 600,
          minHeight: 100,
          maxHeight: 300
        },
        "scrollSync",
        "colorSyntax",
        "uml",
        "mark",
        "table"
      ]}
    />
  );

  //===================================================================================
  render() {
    return (
      <section class="sub_wrap">
        <article class="s_cnt mp_pro_li ct1">
          <div class="li_top">
            <h2 class="s_tit1">공지사항 글쓰기</h2>
          </div>
          <div class="bo_w re1_wrap re1_wrap_writer">
            <form name="" id="" action="" onsubmit="" method="post">
              <article class="res_w">
                <div class="tb_outline">
                  <table class="table_ty1">
                    <tr>
                      <th>
                        <label for="wr_name">
                          옵션<span class="red">(*)</span>
                        </label>
                      </th>
                      <td class="">
                        <ul class="check_ty1">
                          <li>
                            <input type="radio" name="t1" id="noti"></input>
                            <label for="noti">공지</label>
                          </li>
                          <li>
                            <input type="radio" name="t1" id="noti2"></input>
                            <label for="noti2">비밀글</label>
                          </li>
                        </ul>
                      </td>
                    </tr>
                    <tr>
                      <th>
                        <label for="wr_name">
                          작성자<span class="red">(*)</span>
                        </label>
                      </th>
                      <td>
                        <input
                          type="text"
                          name="wr_name"
                          value=""
                          id="wr_name"
                          class=""
                          required
                          styles="width: 140px;"
                        ></input>
                      </td>
                    </tr>
                    <tr>
                      <th>
                        <label for="wr_password">
                          비밀번호<span class="red">(*)</span>
                        </label>
                      </th>
                      <td>
                        <input
                          type="password"
                          name="wr_password"
                          id="wr_password"
                          class=""
                          required
                        />
                      </td>
                    </tr>
                    <tr class="re_email">
                      <th>이메일</th>
                      <td>
                        <input
                          type="text"
                          name=""
                          placeholder="이메일을 입력해주세요."
                        />
                        <span class="e_goll">@</span>
                        <select name="" class="select_ty1">
                          <option value="">선택하세요</option>
                          <option value="naver.com">naver.com</option>
                          <option value="hanmail.net">hanmail.net</option>
                          <option value="nate.com">nate.com</option>
                          <option value="hotmail.com">hotmail.com</option>
                          <option value="gmail.com">gmail.com</option>>
                          <option value="yahoo.co.kr">yahoo.co.kr</option>
                          <option value="yahoo.com">yahoo.com</option>
                        </select>
                      </td>
                    </tr>
                    <tr class="tr_tel">
                      <th>연락처</th>
                      <td>
                        <select id="" name="" class="select_ty1">
                          <option value="">선택</option>
                          <option value="010">010</option>
                          <option value="011">011</option>
                          <option value="016">016</option>
                          <option value="017">017</option>
                          <option value="018">018</option>
                          <option value="019">019</option>
                        </select>
                        <span class="tel_dot">-</span>
                        <input type="text" name="" placeholder="" />
                        <span class="tel_dot">-</span>
                        <input type="text" name="" placeholder="" />
                      </td>
                    </tr>
                    <tr>
                      <th>
                        <label for="wr_subject">
                          제목<span class="red">(*)</span>
                        </label>
                      </th>
                      <td>
                        <input
                          type="text"
                          name="wr_subject"
                          value=""
                          id="wr_subject"
                          class=""
                          required
                        />
                      </td>
                    </tr>
                    <tr>
                      <th>
                        <label for="wr_content">
                          내용<span class="red">(*)</span>
                        </label>
                      </th>
                      <td>{this.state.append_editor}</td>
                    </tr>
                    <tr class="div_tb_tr fileb">
                      <th>파일 #1</th>
                      <td class="fileBox fileBox_w1">
                        <label for="uploadBtn1" class="btn_file">
                          파일선택
                        </label>
                        <input
                          type="text"
                          class="fileName fileName1"
                          readonly="readonly"
                          placeholder="선택된 파일 없음"
                        />
                        <input
                          type="file"
                          id="uploadBtn1"
                          class="uploadBtn uploadBtn1"
                        />
                      </td>
                    </tr>
                    <tr class="div_tb_tr fileb">
                      <th>파일 #2</th>
                      <td class="fileBox fileBox_w1">
                        <label for="uploadBtn1" class="btn_file">
                          파일선택
                        </label>
                        <input
                          type="text"
                          class="fileName fileName1"
                          readonly="readonly"
                          placeholder="선택된 파일 없음"
                        />
                        <input
                          type="file"
                          id="uploadBtn1"
                          class="uploadBtn uploadBtn1"
                        />
                      </td>
                    </tr>
                  </table>
                  <div class="btn_confirm mt20" styles="margin-bottom: 44px;">
                    <a href="" class="bt_ty bt_ty1 cancel_ty1">
                      취소
                    </a>
                    <a href="" class="bt_ty bt_ty2 submit_ty1">
                      저장
                    </a>
                  </div>
                </div>
              </article>
            </form>
          </div>
        </article>
      </section>
    );
  }
}

export default NoticeModify;
