/*
    back-end data에 대한 처리가 필요
*/
import React, { Component } from 'react';
import {Link} from 'react-router-dom';

class QnAView extends Component {

    render () {

        return (
            <section className="sub_wrap">
                <article className="s_cnt mp_pro_li ct1">
                    <div className="li_top">
                        <h2 className="s_tit1">QnA 상세보기</h2>
                    </div>
                    <div className="bo_view">
                        <header>
                            <h1 id="bo_v_title">글 제목이 출력됩니다</h1>
                        </header>
                        <section id="bo_v_info">
                            <h2>페이지 정보</h2>
                            <ul>
                                <li>작성자 : <strong>애드비넷</strong></li>
                                <li>작성일 : <strong>2019.07.23</strong></li>
                                <li>조회 : <strong>36회</strong></li>
                            </ul>
                        </section>
                    </div> 
                    <div id="bo_v_atc">
                        <p>상세내용, 이미지 등이 들어가는 뷰페이지의 내용 위치</p>
                    </div>

                    <div id="bo_v_top">
                        <ul className="bo_v_nb">
                            <li><a href="" className="">이전글</a></li>
                            <li><a href="" className="">다음글</a></li>
                        </ul>
                        <ul className="bo_v_com">
                            {/* 특정 컨텐츠의 id가 필요함 */}
                            <li><Link to={'/community/QnA-answer'} className="">답변</Link></li>
                            <li><Link to={'/community/QnA'} className="">목록</Link></li>
                        </ul>
                    </div>
                </article>
            </section>
        );
    }
}

export default QnAView;