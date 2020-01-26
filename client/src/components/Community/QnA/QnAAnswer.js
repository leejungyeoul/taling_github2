import React, { Component } from 'react';

class QnAAnswer extends Component {

    // input value state
    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    render () {
        const notice_txt = "“의료정보학과 애드비넷“(이하 “회사”)는 개인정보보호법에 따라 이용자의 개인정보 보호 및 권익을 보호하고 개인정보와 관련한 이용자의 고충을 원활하게 처리할 수 있도록 다음과 같은 처리방침을 두고 있습니다. 고객님의 정보는 개인의 소중한 자산인 동시에 회사 운영의 중요한 자료가 됩니다. 그러므로 회사는 운영상의 모든 과정에서 고객님의 개인정보를 보호하는데 최선의 노력을 다할 것을 약속 드립니다. 회사는 개인정보처리방침을 개정하는 경우 웹사이트를 통하여 공지할 것입니다. 제 1장. 개인정보 수집 동의절차 회사는 귀하께서 웹사이트의 개인정보보호방침 또는 이용약관의 내용에 대해 (동의한다)버튼 또는 (동의하지 않는다)버튼을 클릭할 수 있는 절차를 마련하여 (동의한다)버튼을 클릭하면 개인정보 수집에 대해 동의한 것으로 봅니다. 제 2장. 개인정보의 수집 및 이용 목적 회사는 개인정보를 다음의 목적을 위해 활용합니다. 처리한 개인정보는 다음의 목적 이외의 용도로는 사용되지 않으며 이용 목적이 변경될 시 사전동의를 구할 예정입니다. 가. 성명, 아이디, 비밀번호 : 회원 가입의사 확인, 서비스 부정이용 방지, 접속 빈도파악, 회원제 서비스 이용에 따른 본인 식별 절차 나. 이메일주소, 전화번호(수신여부 확인) : 고지사항 전달, 본인 의사 확인, 불만 처리 등 원활한 의사소통 경로의 확보, 이벤트 및 광고성 정보 제공 및 참여기회 제공, 접속 빈도파악 또는 회원의 서비스이용에 대한 통계 다. 주소, 전화번호 : 경품과 물품 배송에 대한 정확한 배송지의 확보 제 3장. 광고정보의 전송 가. 회사는 귀하의 명시적인 수신거부의사에 반하여 영리목적의 광고성 정보를 전송하지 않습니다. 나. 회사는 약관변경, 기타 서비스 이용에 관한 변경사항, 새로운 서비스/신상품이나 이벤트 정보, 기타 상품정보 등을 전자우편, 휴대폰 문자전송 기타 전지적 전송매체 등의 방법으로 알려드립니다. 이 경우 관련 법령상 명시사항 및 명시방법을 준수합니다. 다. 회사는 상품정보 안내 등 온라인 마케팅을 위해 광고성 정보를 전자우편 등으로 전송하는 경우 전자 우편의 제목란 및 본문란에 귀하가 쉽게 알아 볼 수 있도록 조치합니다. 제 4장. 개인정보의 수집범위 회사는 별도의 회원가입 절차 없이 대부분의 콘텐츠에 자유롭게 접근할 수 있습니다. 회원제 서비스를 이용하고자 할 경우 다음의 정보를 입력해주셔야 합니다. 가. 개인정보 수집항목 : 이름, 이메일, 생년월일, 아이디, 비밀번호, 성별, 주소, 휴대폰 번호(전화), 이메일 수신여부, SMS 수신여부, 서비스 이용기록, 접속로그, 받는 고객 정보(이름, 전화번호, 주소, 이메일) 나. 개인정보 수집방법 : 홈페이지 내 회원가입 및 게시판 등 제 5장. 개인정보의 보유 및 이용기간 회사는 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 단, 다음의 정보에 대해서는 아래의 이유로 명시한 기간 동안 보존합니다. -보존항목 : 이름, 로그인 ID, 비밀번호, 이메일, 생년월일 -보존근거 : 불량 회원의 부정한 이용의 재발 방지 -보존기간 : 1개월 그리고 관계법령의 규정에 의하여 보존할 필요가 있는 경우 회사는 아래와 같이 관계법령에서 정한 일정한 기간 동안 회원정보를 보관합니다. 소비자의 불만 또는 분쟁처리에 관한 기록 : 3년 (전자상거래 등에서의 소비자보호에 관한 법률) 제 6장. 개인정보의 파기 절차 및 방법 회사는 원칙적으로 개인정보 처리목적이 달성된 경우에는 지체 없이 해당 개인정보를 파기합니다. 파기의 절차, 기한 및 방법은 다음과 같습니다. -파기절차 회원님이 회원가입 등을 위해 입력하신 정보는 목적 달성 후 별도의 DB로 옮겨져(종이의 경우 별도의 서류함) 내부 방침 및 기타 관련 법령에 의한 정보보호 사유에 따라(보유 및 이용기간 참조) 일정 기간 저장 된 후 파기합니다. 별도 DB로 옮겨진 개인정보는 법률에 의한 경우가 아니고서는 보유 이외의 다른 목적으로 이용되지 않습니다. -파기기한 이용자의 개인정보는 개인정보의 보유기간이 경과된 경우에는 보유기간의 종료일로부터 5일 이내에, 개인정보의 처리 목적 달성, 해당 서비스의 폐지, 사업의 종료 등 그 개인정보가 불필요하게 되었을 때에는 개인정보의 처리가 불필요한 것으로 인정되는 날로부터 5일 이내에 그 개인정보를 파기합니다. -파기방법 전자적 파일 형태의 정보는 기록을 재생할 수 없는 기술적 방법을 사용합니다. 제 7장. 개인정보의 안전성 확보 조치 회사는 개인정보보호법 제29조에 따라 다음과 같이 안전성 확보에 필요한 조치를 하고 있습니다. 가. 개인정보 취급 직원의 최소화 및 교육 개인정보를 취급하는 직원을 지정하고 담당자에 한정시켜 최소화 하여 개인정보를 관리하는 대책을 시행하고 있습니다. 나. 개인정보의 암호화 이용자의 개인정보는 비밀번호는 암호화 되어 저장 및 관리되고 있어, 본인만이 알 수 있으며 중요한 데이터는 파일 및 전송 데이터를 암호화 하거나 파일 잠금 기능을 사용하는 등의 별도 보안기능을 사용하고 있습니다. 제 8장. 개인정보 보호책임자 작성 회사는 고객님께서 정보를 안전하게 이용할 수 있도록 최선을 다하고 있습니다. 고객님의 개인정보를 취급하는 책임자는 다음과 같으며 개인정보 관련 문의사항에 신속하고 성실하게 답변해드리고 있습니다. ▶ 개인정보보호 담당자 이름 : 홍길동 소속/직위 : ○○/○○ e-mail : ○○○@○○○○.net 전화번호 : 02-0000-0000 정보주체께서는 회사 서비스를 이용하시면서 발생한 모든 개인정보 보호 관련 문의, 불만처리, 피해구제 등에 관한 사항을 개인정보 보호책임자 및 담당자에게 문의하실 수 있습니다. 제 9장. 의견수렴 및 불만처리 회사는 회원님의 의견을 소중하게 생각하며, 회원님은 의문사항으로부터 언제나 성실한 답변을 받을 권리가 있습니다. 회사는 회원님과의 원활한 의사소통을 위해 고객센터를 운영하고 있습니다. 실시간 상담 및 전화상담은 영업시간에만 가능합니다. 이메일 및 우편을 이용한 상담은 수신 후 24시간 내에 성실하게 답변 드리겠습니다. 다만, 근무시간 이후 또는 주말 및 공휴일에는 익일 처리하는 것을 원칙으로 합니다. 도용된 개인정보에 대한 회사의 조치는 다음과 같습니다. 1. 이용자가 타인의 기타 개인정보를 도용하여 회원가입 등을 하였음을 알게 된 때에는 지체 없이 해당 아이디에 대한 서비스 이용정지 또는 회원탈퇴 등 필요한 조치를 취합니다. 2. 자신의 개인정보 도용을 인지한 이용자가 해당 아이디에 대해 서비스 이용정지 또는 회원탈퇴를 요구하는 경우에는 즉시 조치를 취합니다. 기타 개인정보에 관한 상담이 필요한 경우에는 개인정보침해신고센터, 대검찰청 인터넷범죄수사센터, 경찰청 사이버테러대응센터 등으로 문의하실 수 있습니다. 개인정보침해센터 (http://www.118.or.kr) 대검찰청 인터넷범죄수사센터 (http://icic.sppo.go.kr) 경찰청 사이버테러대응센터 (http://www.police.go.kr/ctrc/ctrc_main.htm) 제 10장. 고지의 의무 이 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경내용의 추가, 삭제 및 정정이 있는 경우에는 변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다."
        return (
            <section className="sub_wrap">
                <article className="s_cnt mp_pro_li ct1">
                    <div className="li_top">
                        <h2 className="s_tit1">QnA 글쓰기</h2>
                    </div>
                    <div className="bo_w re1_wrap ">
                        <form name="" id="" action="" method="post" >
                            <div className="privacy_area">
                            {/* <!-- 개인정보취급방침 동의 --> */}
                                <h2>개인정보처리방침 동의</h2>
                                <textarea name="" rows="" cols="" className="privacy_box" value={notice_txt} onChange={this.handleChange} ></textarea>
                                <div className="agreen_box">
                                    <input type="radio" id="" name="" value="동의" onChange={this.handleChange} />
                                    <label htmlFor="agree_1">동의함</label>
                                    <input type="radio" id="" name="" value="동의안함" onChange={this.handleChange} />
                                    <label htmlFor="agree_2">동의안함</label>
                                </div>
                            </div>
                                
                            <article className="res_w">
                                <p className="ment">
                                    <span className="red">(*)</span>표시는 필수입력사항 입니다.
                                </p>
                                <div className="tb_outline">
                                    <table className="table_ty1">
                                        <tbody>
                                            <tr>
                                                <th>
                                                    <label htmlFor="wr_name">작성자<span className="red">(*)</span></label>
                                                </th>
                                                <td>
                                                    <input type="text" name="wr_name" value="" id="wr_name" className="" required onChange={this.handleChange} />
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>
                                                    <label htmlFor="wr_password">비밀번호<span className="red">(*)</span></label>
                                                </th>
                                                <td>
                                                    <input type="password" name="wr_password" id="wr_password"  className="" required />
                                                </td>
                                            </tr>
                                        
                                            <tr className="re_email">
                                                <th>이메일</th>
                                                <td>
                                                    <input type="text" name="" placeholder="이메일을 입력해주세요."/>
                                                    <span className="e_goll">@</span>
                                                    <select name="" className="select_ty1">
                                                            <option value="">선택하세요</option>
                                                            <option value='naver.com'>naver.com</option>
                                                            <option value='hanmail.net'>hanmail.net</option>
                                                            <option value='nate.com'>nate.com</option>
                                                            <option value='hotmail.com'>hotmail.com</option>
                                                            <option value='gmail.com'>gmail.com</option>
                                                            <option value='yahoo.co.kr'>yahoo.co.kr</option>
                                                            <option value='yahoo.com'>yahoo.com</option>
                                                    </select>
                                                </td>
                                            </tr>
                                            <tr className="tr_tel">
                                                <th>연락처</th>
                                                <td>
                                                    <select id="" name="" className="select_ty1">
                                                        <option value="">선택</option>
                                                        <option value="010">010</option>
                                                        <option value="011">011</option>
                                                        <option value="016">016</option>
                                                        <option value="017">017</option>
                                                        <option value="018">018</option>
                                                        <option value="019">019</option>
                                                    </select>
                                                    <span className="tel_dot">-</span>
                                                    <input type="text" name="" placeholder=""/>
                                                    <span className="tel_dot">-</span>
                                                    <input type="text" name="" placeholder=""/>	
                                                </td>
                                            </tr>
                                            
                                            <tr>
                                                <th>
                                                    <label htmlFor="wr_subject">제목<span className="red">(*)</span></label>
                                                </th>
                                                <td>
                                                    <div id="autosave_wrapper">
                                                        <input type="text" name="wr_subject" value="" id="wr_subject"  className="" size="" maxLength="" required onChange={this.handleChange} />
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>
                                                    <label htmlFor="wr_content">내용<span className="red">(*)</span></label>
                                                </th>
                                                <td>
                                                    <textarea name="" rows="" cols=""></textarea>
                                                </td>
                                            </tr>
                                        
                                            <tr className="div_tb_tr fileb">
                                                <th>
                                                    파일 #1
                                                </th>
                                                <td className="fileBox fileBox_w1">
                                                    <label htmlFor="uploadBtn1" className="btn_file">파일선택</label>
                                                    <input type="text" className="fileName fileName1" readOnly="readonly" placeholder="선택된 파일 없음"/>
                                                    <input type="file" id="uploadBtn1" className="uploadBtn uploadBtn1"/>	
                                                </td>
                                            </tr>
                                            <tr className="div_tb_tr fileb">
                                                <th>
                                                    파일 #2
                                                </th>
                                                <td className="fileBox fileBox_w1">
                                                    <label htmlFor="uploadBtn1" className="btn_file">파일선택</label>
                                                    <input type="text" className="fileName fileName1" readOnly="readonly" placeholder="선택된 파일 없음"/>
                                                    <input type="file" id="uploadBtn1" className="uploadBtn uploadBtn1"/>	
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>자동등록방지</th>
                                                <td>
                                                    <fieldset id="captcha" className="captcha">
                                                        <legend><label htmlFor="captcha_key">자동등록방지</label></legend>
                                                        <img src={require("../../../img/sub/kcaptcha_image.jpg")} alt="" id="" />
                                                        <button type="button" id="captcha_mp3"><span></span>숫자음성듣기</button>
                                                        <button type="button" id="captcha_reload"><span></span>새로고침</button><input type="text" name="captcha_key" id="captcha_key" required="" className="captcha_box required" size="6" maxLength="6"/>
                                                        <span id="captcha_info">자동등록방지 숫자를 순서대로 입력하세요.</span>
                                                        </fieldset>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <div className="btn_confirm mt20">
                                        <a href="" className="bt_ty bt_ty1 cancel_ty1">취소</a>
                                        <a href="" className="bt_ty bt_ty2 submit_ty1">저장</a>
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

export default QnAAnswer;