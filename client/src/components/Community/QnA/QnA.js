/*
    각 Q&A 목록별 상세보기 페이지에 대한 처리가 필요함
    공지사항과 거의 흡사함
*/

import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import Pagination from '../../Pagination';

class QnA extends Component {
    constructor() {
        super();

        // page 배열 크기 및 세부 정보 json file로 load 해야함
        const itemsMaxNum = 10;
        const itemsWriter = '테스트 글쓴이';
        const itemsDate = '2019-08-20 15:32:10';
        const itemsView = 21;

        var exampleItems = [...Array(itemsMaxNum).keys()].map(i => ({ 
            id: (itemsMaxNum-i),   // 내림차순
            name: 'Item ' + (itemsMaxNum-i),
            writer: itemsWriter,
            date: itemsDate,
            views: itemsView,
        }));

        this.state = {
            totalPages: itemsMaxNum,
            exampleItems: exampleItems,
            pageOfItems: []
        };

        this.onChangePage = this.onChangePage.bind(this);
    }

    onChangePage(pageOfItems) {
        // 현재 항목의 상태를 업데이트
        this.setState({ pageOfItems: pageOfItems });
    }

    // input value state
    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }


    render () {

        return (
            <section className="sub_wrap">
                <article className="s_cnt mp_pro_li ct1">
                    <div className="li_top">
                        <h2 className="s_tit1">QnA 목록</h2>
                    </div>
                        
                    <div className="bo_list">
                        <div className="bo_fx">
                            <div id="bo_list_total">
                                <span>Total {this.state.totalPages}건 </span>페이지
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

                                    {this.state.pageOfItems.map(item =>
                                        <div className="div_tb_tr" key={item.id}>
                                            <div className="div_td col_num">{item.id}</div>
                                            <div className="div_td col_subject">
                                                <Link to = {{ pathname: './QnA-view/contents-1', }}>123</Link>
                                            </div>
                                            <div className="div_td col_writer">{item.writer}</div>
                                            <div className="div_td col_date">{item.date}</div>
                                            <div className="div_td col_hit">{item.views}</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </form>
                        <div className="sch_wra">
                            <fieldset id="bo_sch">
                                <legend>게시물 검색</legend>
                                <form name="" method="get">
                                    <input type="hidden" name="" value="" onChange={this.handleChange} />
                                    <input type="hidden" name="" value="" onChange={this.handleChange} />
                                    <input type="hidden" name="" value="" onChange={this.handleChange} />
                                    <select name="">
                                        <option value="">제목</option>
                                        <option value="">내용</option>
                                        <option value="">제목+내용</option>
                                    </select>
                                    <input type="text" name="" value="" placeholder="검색어(필수)" required id="" className="required frm_input" onChange={this.handleChange} />
                                    <input type="submit" value="검색" className="btn_submit" onChange={this.handleChange} />
                                </form>
                            </fieldset>
                        </div>
                    </div>
                    <div class="page_ty1">
                        <Pagination items={this.state.exampleItems} onChangePage={this.onChangePage} />
                    </div>
                </article>
            </section>
        );
    }
}

export default QnA;