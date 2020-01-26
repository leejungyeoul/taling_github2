import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import axios from "axios";
import $ from 'jquery';
import cookie from 'react-cookies';
import Swal from 'sweetalert2'

class SoftwareView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            responseSwtoolInfo: '',//swtool 정보 response 변수
            append_SwtoolInfo: '', //swtool 정보 append 변수

            responseSwFuncList: '',//swtool 정보 response 변수
            append_SwFuncList: '', //swtool 정보 append 변수

            before_swtcode: props.match.params.swtcode, //swtool 정보 swtool 코드
            swtcode: '', //swtool 저장 swtool 코드
            swt_toolname: '', //swtool 정보 sw툴 명
            swt_demo_site: '',//swtool 정보 데모사이트
            swt_github_url: '',//swtool 정보 깃허브 주소
            swt_comments: '',//swtool 정보 설명
            swt_function: '',//swtool 정보 기능

            //이미지 업로드
            file: '',//메인 이미지 미리보기용 path
            file2: '',//라벨 이미지 미리보기용 path
            fileName: '',//메인 이미지명
            fileName2: '',//라벨 이미지명
            menualName: '',//메뉴얼명
            selectedFile: null, //업로드 대상 파일

            admin_userid: '', //userid hidden 값 세팅
            admin_usernm:'', //관리자 이름
        }
        this.handleFileInput = this.handleFileInput.bind(this)
    }
    componentDidMount () {
        // SW Tool 정보 호출
        this.callSwToolInfoApi()
        if(this.state.before_swtcode == 'register'){
            $('.modifyclass').hide()
        }else{
            $('.saveclass').hide()
        }
        // 세션 처리
        this.callSessionInfoApi()
    }

    //로그 저장
    saveLogMessage = (log_cd, log_contents) => {
        axios.post('/api/system?type=log', {
            is_Log_cd : log_cd,
            is_Log_contents : log_contents,
            is_Reg_usernm : this.state.admin_usernm,
            is_Reg_user : this.state.admin_userid,
        })
        .then( response => {
        })
        .catch( response => {this.sweetalert('작업중 오류가 발생하였습니다.', response, 'error', '닫기')} ); 
    }

    // 쿠키값 userid, username 호출
    callSessionInfoApi = (type) => {
        axios.post('/api/LoginForm?type=SessionConfirm', {
            token1 : cookie.load('userid') 
            , token2 : cookie.load('username') 
        })
        .then( response => {
            this.state.admin_userid = response.data.token1
            this.state.admin_usernm = response.data.token2
        })
        .catch( error => {this.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기');return false;} );
    }

    //업로드할 파일 세팅
    handleFileInput(type, e){
        var id = e.target.id
        if(type =='file'){
            $('#imagefile').val(e.target.files[0].name)
        }else if(type =='file2'){
            $('#imagefile2').val(e.target.files[0].name)
        }else if(type =='manual'){
            $('#manualfile').val(e.target.files[0].name)
        }
        this.setState({
          selectedFile : e.target.files[0],
        })

        if(type =='manual'){
            setTimeout(function() {
                this.handlePostMenual(type, id ,e)
            }.bind(this),1
            );
        }else{
            setTimeout(function() {
                this.handlePostImage(type, id ,e)
            }.bind(this),1
            );
        }
    }

    //메뉴얼 업로드
    handlePostMenual(type, id, e){
        const formData = new FormData();
        formData.append('file', this.state.selectedFile);
    
        return axios.post("/api/upload?type=uploads/swmanual/", formData).then(res => {
            try {

                this.state.menualName = res.data.filename
                
                $('#upload_menual').prepend('<input id="is_MenualName" type="hidden" name="is_MenualName" value="'+this.state.menualName+'"}/>')
            } catch (error) {
                this.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기')
            }
        }).catch(error => {
            this.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기')
        })
    }    

    //이미지 업로드
    handlePostImage(type, id, e){
        const formData = new FormData();
        formData.append('file', this.state.selectedFile);
    
        return axios.post("/api/upload?type=uploads/image/", formData).then(res => {
            try {
                setTimeout(function() {
                    if(type =='file'){
                        this.state.file = '/image/'+res.data.filename
                        this.state.fileName = res.data.filename
                        $('#uploadimg').show()
                        $('#is_MainImg').remove()
                        $('#uploadimg').remove()
                        $('#upload_img').prepend('<img id="uploadimg" src="'+this.state.file+'"/>')
                        $('#upload_img').prepend('<input id="is_MainImg" type="hidden" name="is_MainImg" value="'+this.state.fileName+'"}/>')
                        
                    }else if(type =='file2'){
                        this.state.file2 = '/image/'+res.data.filename
                        this.state.fileName2 = res.data.filename
                        $('#uploadimg2').show()
                        $('#is_LabelImg').remove()
                        $('#uploadimg2').remove()
                        $('#upload_img2').prepend('<img id="uploadimg2" src="'+this.state.file2+'"/>')
                        $('#upload_img2').prepend('<input id="is_LabelImg" type="hidden" name="is_LabelImg" value="'+this.state.fileName2+'"}/>')
                    }
                }.bind(this),1000
                );

            } catch (error) {
                this.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기')            
            }
        }).catch(error => {
            this.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기')            
        })
    }

    // SW Tool 정보 호출
    callSwToolInfoApi = async () => {
        //SW Tool List 호출
        axios.post('/api/Swtool?type=info', {
            is_Swtcode: this.state.before_swtcode,
        })
        .then( response => {
            try {
                this.setState({ responseSwtoolInfo: response });
                this.setState({ append_SwtoolInfo: this.SwToolInfoAppend() });

                $('#is_Swt_toolname').val(this.state.swt_toolname)
                $('#is_Swt_demo_site').val(this.state.swt_demo_site)
                $('#is_Giturl').val(this.state.swt_github_url)
                $('#is_Comments').val(this.state.swt_comments)
                $('#is_Swt_function').val(this.state.swt_function)
                
                $('#upload_img').prepend('<img id="uploadimg" src="'+this.state.file+'"/>')
                $('#upload_img').prepend('<input id="is_MainImg" type="hidden" name="is_MainImg" value="'+this.state.fileName+'"}/>')
                
                $('#upload_img2').prepend('<img id="uploadimg2" src="'+this.state.file2+'"/>')
                $('#upload_img2').prepend('<input id="is_LabelImg" type="hidden" name="is_LabelImg" value="'+this.state.fileName2+'"}/>')
                
                $('#imagefile').val(this.state.fileName)
                $('#imagefile2').val(this.state.fileName2)
                $('#manualfile').val(this.state.menualName)

                if($('#uploadimg').attr('src') == ''){
                    $('#uploadimg').hide()
                    $('#uploadimg2').hide()
                }

            } catch (error) {
                this.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기')
            }
        })
        .catch( error => {this.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기');return false;} );
    }

    // SW Tool 정보 append
    SwToolInfoAppend = () => {
        let result = []
        var SwToolInfo = this.state.responseSwtoolInfo.data
        
            if(this.state.before_swtcode != 'register'){
                var data = SwToolInfo.json[0]

                this.state.swt_toolname = data.swt_toolname
                this.state.swt_demo_site = data.swt_demo_site
                this.state.swt_github_url = data.swt_github_url
                this.state.swt_comments = data.swt_comments
                this.state.swt_function = data.swt_function

                this.state.file = '/image/'+data.swt_big_imgpath
                this.state.fileName = data.swt_big_imgpath
                $('#imagefile').val(data.swt_big_imgpath)
                $('#uploadimg').show()
                this.state.file2 = '/image/'+data.swt_imagepath
                this.state.fileName2 = data.swt_imagepath
                $('#imagefile2').val(data.swt_imagepath)
                $('#uploadimg2').show()

                this.state.menualName = data.swt_manual_path
            }

            result.push(
                <table class="table_ty1">
                    <tr>
                        <th>
                            <label for="is_Swt_toolname">툴 이름<span class="red">(*)</span></label>
                        </th>
                        <td>
                            <input type="text" name="is_Swt_toolname" id="is_Swt_toolname" class="" />
                        </td>
                    </tr>
                    <tr>
                        <th>
                            <label for="is_Swt_demo_site">데모 URL<span class="red">(*)</span></label>
                        </th>
                        <td>
                            <input type="text" name="is_Swt_demo_site" id="is_Swt_demo_site" class="" />
                        </td>
                    </tr>
                    <tr>
                        <th>
                            <label for="is_Giturl">Github URL<span class="red">(*)</span></label>
                        </th>
                        <td>
                            <input type="text" name="is_Giturl" id="is_Giturl" class="" />
                        </td>
                    </tr>
                    <tr>
                        <th>
                            <label for="is_Comments">설명<span class="red">(*)</span></label>
                        </th>
                        <td>
                            <textarea name="is_Comments" id="is_Comments" rows="" cols=""></textarea>
                        </td>
                    </tr>
                    <tr class="div_tb_tr fileb">
                        <th>
                            메뉴얼 파일 #1
                        </th>
                        <td class="fileBox fileBox_w1">
                            <label for="uploadBtn1" class="btn_file">파일선택</label>
                            <input type="text" id="manualfile" class="fileName fileName1" readonly="readonly" placeholder="선택된 파일 없음"/>
                            <input type="file" id="uploadBtn1" class="uploadBtn uploadBtn1" onChange={e => this.handleFileInput('manual',e)}/>	
                            <div id="upload_menual">
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <th>
                            메인 이미지
                        </th>
                        <td className="fileBox fileBox1">
                            <label htmlFor='imageSelect' className="btn_file">파일선택</label>
                            <input type="text" id="imagefile" className="fileName fileName1" readOnly="readonly" placeholder="선택된 파일 없음"/>
                            <input type="file" id="imageSelect" className="uploadBtn uploadBtn1" onChange={e => this.handleFileInput('file',e)}/>
                            <div id="upload_img">
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <th>
                            라벨 이미지
                        </th>
                        <td className="fileBox fileBox2">
                            <label htmlFor='imageSelect2' className="btn_file">파일선택</label>
                            <input type="text" id="imagefile2" className="fileName fileName1" readOnly="readonly" placeholder="선택된 파일 없음"/>
                            <input type="file" id="imageSelect2" className="uploadBtn uploadBtn1" onChange={e => this.handleFileInput('file2',e)}/>
                            <div id="upload_img2">
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <th>
                            <label for="is_Swt_function">상세 기능<span class="red">(*)</span></label>
                        </th>
                        <td>
                            <textarea name="is_Swt_function" id="is_Swt_function" rows="" cols=""></textarea>
                        </td>
                    </tr>
                </table>
            )
        return result
    }

    // 저장 버튼 클릭시 validate check
    submitClick = async (type, e) => {

        this.Swt_toolname_checker = $('#is_Swt_toolname').val();
        this.Swt_demo_site_checker = $('#is_Swt_demo_site').val();
        this.Giturl_checker = $('#is_Giturl').val();
        this.Comments_checker = $('#is_Comments').val();
        this.Swt_function_checker = $('#is_Swt_function').val();

        this.fnValidate = (e) => {

            // ## Swt_toolname check start 
            if(this.Swt_toolname_checker === '') {
                $('#is_Swt_toolname').addClass('border_validate_err');
                this.sweetalert('툴 이름을 다시 확인해주세요.', '', 'info', '닫기')
                return false;
            }
            $('#is_Swt_toolname').removeClass('border_validate_err');

            // ## Swt_demo_site check start 
            if(this.Swt_demo_site_checker === '') {
                $('#is_Swt_demo_site').addClass('border_validate_err');
                this.sweetalert('데모 URL을 다시 확인해주세요.', '', 'info', '닫기')
                return false;
            }
            $('#is_Swt_demo_site').removeClass('border_validate_err');

            // ## Giturl check start 
            if(this.Giturl_checker === '') {
                $('#is_Giturl').addClass('border_validate_err');
                this.sweetalert('Github URL을 다시 확인해주세요.', '', 'info', '닫기')
                return false;
            }
            $('#is_Giturl').removeClass('border_validate_err');

            // ## Comments check start 
            if(this.Comments_checker === '') {
                $('#is_Comments').addClass('border_validate_err');
                this.sweetalert('설명을 다시 확인해주세요.', '', 'info', '닫기')
                return false;
            }
            $('#is_Comments').removeClass('border_validate_err');

            // ## Swt_function check start 
            if(this.Swt_function_checker === '') {
                $('#is_Swt_function').addClass('border_validate_err');
                this.sweetalert('상세기능을 다시 확인해주세요.', '', 'info', '닫기')
                return false;
            }
            $('#is_Swt_function').removeClass('border_validate_err');

            var date = new Date()
            var y_str = date.getFullYear().toString();

            var month = date.getMonth()+1
            var m_str = month.toString();

            var day = date.getDate()
            var d_str = day.toString();

            var hour = date.getHours()
            var min = date.getMinutes()
            var sec = date.getSeconds()

            // 프로젝트 코드생성
            this.state.swtcode = 'USW'+y_str+m_str+d_str+hour+min+sec
            
            $('#is_Swtcode').val(this.state.swtcode)

            return true;
        }

        //유효성 체크
        if(this.fnValidate()){
            //software Tools 저장
            //form type To Json
            var jsonstr = $("form[name='frm']").serialize();
            //특수문자 깨짐 해결
            jsonstr = decodeURIComponent(jsonstr);
            var Json_form = JSON.stringify(jsonstr).replace(/\"/gi,'')
            Json_form = "{\"" +Json_form.replace(/\&/g,'\",\"').replace(/=/gi,'\":"')+"\"}";
        
            try {
                const response = await fetch('/api/Swtool?type='+type, {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json',
                    },
                    //한글 디코딩
                    body: Json_form,
                });
                const body = await response.text();
                if(body == "succ"){
                    if(type == 'save'){
                        this.sweetalertSucc('Software Tools 등록이 완료되었습니다.', false)
                        this.saveLogMessage('LG9','Software Tools을 등록했습니다. Tool 명 : '+this.Swt_toolname_checker+' 관리자 계정 : '+this.state.admin_userid)
                    }else if(type == "modify"){
                        this.sweetalertSucc('DSoftware Tools 수정이 완료되었습니다.', false)
                        this.saveLogMessage('LG9','Software Tools을 수정했습니다. Tool 명 : '+this.Swt_toolname_checker+' 관리자 계정 : '+this.state.admin_userid)
                    }

                    const response = await axios.get('/api/cmpathinfo');
                    window.location.href = response.data.home_url+'/AdminSoftwareList';
                }else{
                    this.sweetalert('작업중 오류가 발생하였습니다.', '', 'error', '닫기')
                }  
            } catch (error) {
                this.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기')
            }
        }//fnValidate end

    };

    //alert 기본 함수
    sweetalert = (title, contents, icon, confirmButtonText) => {
        Swal.fire({
            title: title,
            text: contents,
            icon: icon,
            confirmButtonText: confirmButtonText
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
            <section class="sub_wrap">
                <article class="s_cnt mp_pro_li ct1">
                    <div class="li_top">
                        <h2 class="s_tit1">Software Tools 등록/수정</h2>
                    </div>
                    <div class="bo_w re1_wrap re1_wrap_writer">
                        <form name="frm" id="frm" action="" onsubmit="" method="post" >
                            <input id="is_Email" type="hidden" name="is_Email" value={this.state.admin_userid} />
                            <input id="is_Swtcode" type="hidden" name="is_Swtcode" value={this.state.swtcode} />
                            <input id="is_beforeSwtcode" type="hidden" name="is_beforeSwtcode" value={this.state.before_swtcode} />
                            
                            <article class="res_w">
                                <p class="ment" style={{"text-align": "right"}}>
                                    <span class="red">(*)</span>표시는 필수입력사항 입니다.
                                </p>
                                <div class="tb_outline">
                                    {this.state.append_SwtoolInfo}

                                    <div class="btn_confirm mt20" style={{"margin-bottom": "44px"}}>
                                        <Link to={'/AdminSoftwareList'} className="bt_ty bt_ty1 cancel_ty1">취소</Link>
                                        <a href="javascript:" className="bt_ty bt_ty2 submit_ty1 saveclass" onClick={(e) => this.submitClick('save', e)}>저장</a>
                                        <a href="javascript:" className="bt_ty bt_ty2 submit_ty1 modifyclass" onClick={(e) => this.submitClick('modify', e)}>수정</a>
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

export default SoftwareView;