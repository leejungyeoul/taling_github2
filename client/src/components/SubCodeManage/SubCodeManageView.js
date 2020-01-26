import React, { Component } from 'react';
import axios from "axios";
import $ from 'jquery';
import Swal from 'sweetalert2'
import cookie from 'react-cookies';

class SubCodeManage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            responseSubCodeList: '',//SubCode response 리스트
            append_SubCodeList: '',//SubCode 리스트1
            append_SubCodeList2: '',//SubCode 리스트2
            code: '',// 검색욕 subcode
            beforecode: '',// 이전 선택 코드
            beforecodecolor: '',// 이전 선택 코드 색상
            admin_usernm:'', //관리자 이름
            admin_userid:'', //관리자 아이디
        }
    }

    componentDidMount() {
        // 서브 코드 리스트 호출
        this.callSubCodeListApi()
        // 세션 처리
        this.callSessionInfoApi()
    }

    // 서브 코드 리스트 호출
    callSubCodeListApi = async (code) => {
        axios.post('/api/getSubCode', {
            is_Code : code
        })
        .then( response => {
            try {
                this.setState({ responseSubCodeList: response });
                this.setState({ append_SubCodeList: this.SubCodeListAppend() });
            } catch (error) {
                this.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기')
            }
        })
        .catch( error => {this.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기');return false;} );
    }

    // 서브 코드 삭제
    Codedelete = async () => {
     var is_Mst_code_cd = $('#is_Mst_code_cd').val()
     var is_Code_cd = $('#is_Code_cd').val()
     
     if(is_Mst_code_cd == '' || is_Mst_code_cd == undefined || is_Code_cd == '' || is_Code_cd == undefined){
        this.sweetalert('삭제할 코드를 선택해 주세요.', '', 'info', '닫기')
        return false;
     }

        var tmpthis = this
        this.sweetalertDelete('정말 삭제하시겠습니까?', function() {
            axios.post('/api/getSubCode?type=deleteSub', {
                is_Code_cd : is_Code_cd,
            })
            .then( response => {

                axios.post('/api/getSubCode?type=deleteMst', {
                    is_Mst_code_cd : is_Mst_code_cd,
                })
                .then( response => {
                    try {
                        window.location.reload();
                    } catch (error) {
                        tmpthis.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기')
                    }
                })
            })
            .catch( error => {tmpthis.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기');return false;} );
        })
    }

    // 서브 코드 리스트 append
    SubCodeListAppend = () => {
        let result = []
        var SubCodeList = this.state.responseSubCodeList.data
        try {
            for(let i=0; i<SubCodeList.json.length; i++){
                var data = SubCodeList.json[i]
    
                var temp = 'mst_code_cd_'+i
                var temp2 = 'mst_code_nm_'+i
                var temp3 = 'code_cd_'+i
                var temp4 = 'code_nm_'+i
    
                var temp5 = 'tr_'+i
    
                result.push(
                    <tr className="hidden_type trshow" id={temp5}>
                        <td onClick={(e) => this.CodeRegister(i)}>{data.mst_code_cd}</td>
                        <td onClick={(e) => this.CodeRegister(i)}>{data.mst_code_nm}</td>
                        <td onClick={(e) => this.CodeRegister(i)}>{data.code_cd}</td>
                        <td onClick={(e) => this.CodeRegister(i)}>{data.code_nm}</td>
                        <input id={temp} type="hidden" name="" value={data.mst_code_cd} />
                        <input id={temp2} type="hidden" name="" value={data.mst_code_nm} />
                        <input id={temp3} type="hidden" name="" value={data.code_cd} />
                        <input id={temp4} type="hidden" name="" value={data.code_nm} />
                    </tr>
                )
            }
            return result
            
        } catch (error) {
            alert('1' + error)
        }
    }

    // 서브 코드 추가
    SubCodeListAppend2 = (i) => {
        let result = []

        var save_type = 'save'
        if(i !='reg'){
            var save_type = 'update'
        }
        result.push(
            <tr className="hidden_type">
                <td><input type="text" id="is_Mst_code_cd" name="is_Mst_code_cd" placeholder="마스터코드를 입력해주세요."/></td>
                <td><input type="text" id="is_Mst_code_nm" name="is_Mst_code_nm" placeholder="마스터코드명을 입력해주세요."/></td>
                <td><input type="text" id="is_Code_cd" name="is_Code_cd" placeholder="서브코드를 입력해주세요."/></td>
                <td><input type="text" id="is_Code_nm" name="is_Code_nm" placeholder="서브코드명을 입력해주세요."/>
                   <a href="javascript:" className="bt_tyc bt_ty2 submit_ty1"onClick={(e) => this.submitClick(save_type, e)} >저장</a>
                </td>
            </tr>
        )
        return result
    }

    // 쿠키값 userid, username 호출
    callSessionInfoApi = (type) => {
        axios.post('/api/LoginForm?type=SessionConfirm', {
            token1 : cookie.load('userid') 
            , token2 : cookie.load('username') 
        })
        .then( response => {
            this.state.admin_userid = response.data.token1
        })
        .catch( error => {this.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기');return false;} );
    }


    submitClick = async (save_type, e) => {
        this.is_Code_cd = $('#is_Code_cd').val()
        axios.post('/api/getSubCode?type=doubleCheck', {
            is_Subcode : this.is_Code_cd
        })
        .then( response => {
            if(response.data.json[0].num != 0 && save_type != 'update'){
                this.sweetalert('이미 존재하는 서브코드 입니다.', '', 'info', '닫기')
            }else{
                this.submitClick2(save_type)
            }
        })
        .catch( error => {this.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기');return false;} );

    }

    submitClick2 = async (save_type, e) => {

        this.is_Mst_code_cd = $('#is_Mst_code_cd').val()
        this.is_Mst_code_nm = $('#is_Mst_code_nm').val()
        this.is_Code_cd = $('#is_Code_cd').val()
        this.is_Code_nm = $('#is_Code_nm').val()

        this.fnValidate = (e) => {
            if(this.is_Mst_code_cd === '') {
                this.sweetalert('마스터 코드가 없습니다.', '입력해주세요.', 'warning', '닫기')
                return false;
            }
            if(this.is_Mst_code_nm === '') {
                this.sweetalert('마스터 코드명이 없습니다.', '입력해주세요.', 'warning', '닫기')
                return false;
            }
            if(this.is_Code_cd === '') {
                this.sweetalert('서브 코드가 없습니다.', '입력해주세요.', 'warning', '닫기')
                return false;
            }
            if(this.is_Code_nm === '') {
                this.sweetalert('서브 코드명이 없습니다.', '입력해주세요.', 'warning', '닫기')
                return false;
            }
            return true;
        }

        if(this.fnValidate()){
            if(save_type == 'save'){
                axios.post('/api/getSubCode?type=InsertSub', {
                    is_Mst_code_cd: this.is_Mst_code_cd,
                    is_Mst_code_nm: this.is_Mst_code_nm,
                    is_Code_cd: this.is_Code_cd,
                    is_Code_nm: this.is_Code_nm,
                    is_User_email : this.state.admin_userid
                })
                .then( response => {
                    axios.post('/api/getSubCode?type=InsertMst', {
                        is_Mst_code_cd: this.is_Mst_code_cd,
                        is_Mst_code_nm: this.is_Mst_code_nm,
                        is_Code_cd: this.is_Code_cd,
                        is_Code_nm: this.is_Code_nm,
                        is_User_email : this.state.admin_userid
                    })
                    .then( response => {
                        this.sweetalertSucc('서브코드 저장이 완료되었습니다.', false)
                        window.location.reload();
                    })
                    .catch( response => {return false;} );

                })
                .catch( response => {return false;} );
            }else if(save_type == 'update'){
                axios.post('/api/getSubCode?type=update', {
                    is_Mst_code_cd: this.is_Mst_code_cd,
                    is_Mst_code_nm: this.is_Mst_code_nm,
                    is_Code_cd: this.is_Code_cd,
                    is_Code_nm: this.is_Code_nm,
                    is_User_email : this.state.admin_userid
                })
                .then( response => {
                    this.sweetalertSucc('서브코드 수정이 완료되었습니다.', false)
                    window.location.reload();
                })
                .catch( response => {return false;} );
            }
        }
    }

    //검색 결과 호출
    searchApiCall = (e) => {
        this.state.code = $("input[name='is_Code']").val()
        // 서브 코드 리스트 호출
        this.callSubCodeListApi(this.state.code)
    }

    //코드 등록
    CodeRegister = (i, e) => {
        this.setState({ append_SubCodeList2: this.SubCodeListAppend2(i) });

        var tmp_this = this
        $('#tr_'+tmp_this.state.beforecode).css( "background", tmp_this.state.beforecodecolor )

        setTimeout(function() {
            $('#is_Mst_code_cd').val($('#mst_code_cd_'+i).val())
            $('#is_Mst_code_nm').val($('#mst_code_nm_'+i).val())
            $('#is_Code_cd').val($('#code_cd_'+i).val())
            $('#is_Code_nm').val($('#code_nm_'+i).val())

            if(i == 'reg'){
                $('#is_Mst_code_cd').attr("readonly",false); 
                $('#is_Code_cd').attr("readonly",false); 
            }else{
                $('#is_Mst_code_cd').attr("readonly",true); 
                $('#is_Code_cd').attr("readonly",true); 
            }

            tmp_this.state.beforecode = i
            tmp_this.state.beforecodecolor = $('#tr_'+i).css( "background")

            $('#tr_'+i).css( "background", "#bbea28" )
            }.bind(this),100
        );
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

    //alert 삭제 함수
    sweetalertDelete = (title, callbackFunc) => {
        Swal.fire({
            title: title,
            text: "",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes'
            }).then((result) => {
            if (result.value) {
                Swal.fire(
                'Deleted!',
                '삭제되었습니다.',
                'success'
                )
            }else{
                return false;
            }
            callbackFunc()
            })
    }

    //alert 성공 함수
    sweetalertSucc = (title, showConfirmButton) => {
        Swal.fire({
            position: 'bottom-end',
            icon: 'success',
            title: title,
            showConfirmButton: showConfirmButton,
            timer: 1000
        })
    }

    render () {
        return (
            <section className="sub_wrap" >
                <article className="s_cnt mp_pro_li ct1 mp_pro_li_admin">
                    <div className="li_top">
                        <h2 className="s_tit1">서브코드 목록</h2>
                        <div className="us_top af" style={{width:"500px" ,float:'left'}}>
                            <div className="user_sch user_sch1 user_sch0">
                                <label>코드 | 코드명</label>
                                <input type="text" name="is_Code" placeholder="코드 or 코드명 입력"/>
                                <a className="bt_c1 sch_bt3"href="#n" onClick={this.searchApiCall}>조회</a>
                            </div>
                        </div>
                        <div class="li_top_sch af" style={{float:'right'}}>
                            <a href="javascript::" className="sch_bt2 wi_au" onClick={(e) => this.Codedelete(e)}>코드 삭제</a>
                            <a href="javascript::" className="sch_bt2 wi_au" onClick={(e) => this.CodeRegister('reg')}>코드 등록</a>
                        </div>
                    </div>

                    <div className="list_cont list_cont_admin" style={{overflow:'scroll', width:'100%', height:'1000px'}}>
                        <table className="table_ty1" >
                            <tr>
                                <th className="sort"><a href="javascript::" >마스터 코드</a></th>
                                <th className="sort"><a href="javascript::" >마스터 코드명</a></th>
                                <th className="sort"><a href="javascript::" >서브 코드</a></th>
                                <th className="sort"><a href="javascript::" >서브 코드명</a></th>
                            </tr>
                        </table>
                        <table className="table_ty2">
                            {this.state.append_SubCodeList2}
                            {this.state.append_SubCodeList}
                        </table>
                    </div>    
                </article>
            </section>
        );
    }
}

export default SubCodeManage;