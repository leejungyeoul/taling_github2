import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
    items: PropTypes.array.isRequired,
    onChangePage: PropTypes.func.isRequired,
    initialPage: PropTypes.number,
    pageSize: PropTypes.number
}

const defaultProps = {
    initialPage: 1,
    pageSize: 10
}

class Pagination extends React.Component {

    constructor(props) {
        super(props);
        this.state = { pager: {} };
    }

    componentWillMount() {
        // array empty 체크
        if (this.props.items && this.props.items.length) {
            this.setPage(this.props.initialPage);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        // array가 변경되면 리셋
        if (this.props.items !== prevProps.items) {
            this.setPage(this.props.initialPage);
        }
    }

    setPage(page) {
        var { items, pageSize } = this.props;
        var pager = this.state.pager;

        if (page < 1 || page > pager.totalPages) {
            return;
        }

        // 지정 페이지에 대한 새로운 페이저
        pager = this.getPager(items.length, page, pageSize);

        // 배열에서 새로운 페이지를 가져옴
        var pageOfItems = items.slice(pager.startIndex, pager.endIndex + 1);

        // state 업데이트
        this.setState({ pager: pager });

        // 부모 컴포넌트에서 function 호출
        this.props.onChangePage(pageOfItems);
    }

    getPager(totalItems, currentPage, pageSize) {
        // 최초 페이지
        currentPage = currentPage || 1;

        // 기본 페이지 크기
        pageSize = pageSize || 10;

        // 모든 페이지 갯수 계산
        var totalPages = Math.ceil(totalItems / pageSize);

        var startPage, endPage;
        if (totalPages <= 10) {
            // 모든 페이지가 10페이지를 넘지 않으면 전부 노출
            startPage = 1;
            endPage = totalPages;
        } else {
            // 10 페이지 넘을 경우 start end로 설정
            if (currentPage <= 6) {
                startPage = 1;
                endPage = 10;
            } else if (currentPage + 4 >= totalPages) {
                startPage = totalPages - 9;
                endPage = totalPages;
            } else {
                startPage = currentPage - 5;
                endPage = currentPage + 4;
            }
        }

        // index 계산
        // 최신글이 가장 처음으로
        var startIndex = (currentPage - 1) * pageSize;
        var endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

        // 페이저 컨트롤러 생성
        var pages = [...Array((endPage + 1) - startPage).keys()].map(i => startPage + i);

        // 필요한 모든 변수 return
        return {
            totalItems: totalItems,
            currentPage: currentPage,
            pageSize: pageSize,
            totalPages: totalPages,
            startPage: startPage,
            endPage: endPage,
            startIndex: startIndex,
            endIndex: endIndex,
            pages: pages
        };
    }

    // ### render start ###
    render() {
        var pager = this.state.pager;

        if (!pager.pages || pager.pages.length <= 1) {
            // 1 페이지보다 작으면 페이징 노출하지않음
            return null;
        }

        return (
            <ul className="pagination">
                <li className={pager.currentPage === 1 ? 'disabled' : 'start_page'}>
                    <a onClick={() => this.setPage(1)}></a>
                </li>
                <li className={pager.currentPage === 1 ? 'disabled' : ''}>
                    <a onClick={() => this.setPage(pager.currentPage - 1)}>이전</a>
                </li>
                {pager.pages.map((page, index) =>
                    <li key={index} className={pager.currentPage === page ? 'on' : ''}>
                        <a onClick={() => this.setPage(page)}>{page}</a>
                    </li>
                )}
                <li className={pager.currentPage === pager.totalPages ? 'disabled' : ''}>
                    <a onClick={() => this.setPage(pager.currentPage + 1)}>다음</a>
                </li>
                <li className={pager.currentPage === pager.totalPages ? 'disabled' : 'last_page'}>
                    <a onClick={() => this.setPage(pager.totalPages)}></a>
                </li>
            </ul>
        );
    }
}

Pagination.propTypes = propTypes;
Pagination.defaultProps = defaultProps;
export default Pagination;