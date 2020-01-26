import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import axios from "axios";
import $ from 'jquery';
import cookie from 'react-cookies';
import { RangeDatePicker } from '@y0c/react-datepicker';
import "dayjs/locale/ko";
import "../../css/red.scss";
import '../../css/project.css';
import Swal from 'sweetalert2'

class DataSourceView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            responseDataSourceInfo: '',//datasource 정보 response 변수
            append_DataSourceInfo: '', //datasource 정보 append 변수

            responseSubCode: '',    //subcode response 변수
            append_DatasourceType: '',   //Datatsource append 변수

            before_dscode: props.match.params.dscode, //datasource 정보 swtool 코드
            dscode: '', //datasource 저장 datasource 코드
            ds_name: '', //datasource 정보 datasource name
            dstypecd: '', //datasource 정보 type 코드

            //달력
            calender_click_show:false,

            //이미지 업로드
            file: '',//메인 이미지 미리보기용 path
            file2: '',//라벨 이미지 미리보기용 path
            fileName: '',//메인 이미지명
            fileName2: '',//라벨 이미지명
            selectedFile: null, //업로드 대상 파일

            ds_dbname: '', //datasource 정보 db 명
            ds_cdm_version: '', //datasource 정보 cdm 버전
            Ds_holdorg: '', //datasource 정보 소속기관
            ds_patnt_count: '', //datasource 정보 환자수
            ds_db_location: '', //datasource 정보 위치
            ds_comments: '', //datasource 정보 설명
            ds_startdate: '', //datasource 정보 데이터 시작시간
            ds_enddate: '', //datasource 정보 데이터 종료시간
            ds_data_type: '', //datasource 정보 데이터 타입
            ds_type: '', //datasource 정보 구분

            admin_userid: '', //userid hidden 값 세팅
            admin_usernm:'', //관리자 이름
        }
    }

    componentDidMount () {
        // SubCode 호출
        this.callSubCodeApi('DS')
        setTimeout(function() {
            // datasource 정보 호출
            this.callDatasourceInfoApi()
            }.bind(this),100
        );
        setTimeout(function() {
            if(this.state.append_DatasourceType == ''){
                this.callDatasourceInfoApi()
            }
            }.bind(this),1000
        );
        if(this.state.before_dscode == 'register'){
            $('.modifyclass').hide()
        }else{
            $('.saveclass').hide()
        }
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

    // SubCode 호출
    callSubCodeApi = async (mstcode) => {
        try {
            const response = await fetch('/api/getSubCode', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ is_Subcode : mstcode}),
            });
            
            const body = await response.json();
            this.setState({ responseSubCode: body });
            this.setState({ append_DatasourceType: this.DsTypeAppend() });
        } catch (error) {
            this.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기')
        }
    };

    // 연구분야 리스트
    DsTypeAppend = () => {
        let result = []
        for(let i=0; i<this.state.responseSubCode.json.length; i++){
            var check='check'+i
            
            result.push(
                <li><input type="radio" id={check} className={this.state.responseSubCode.json[i].code_cd} name="is_Ds_type" value={this.state.responseSubCode.json[i].code_cd}/>
                    <label for={check}>{this.state.responseSubCode.json[i].code_nm}</label>
                    <span></span>
                </li>
            )
        }
        return result
    }

    // Datasource 정보 호출
    callDatasourceInfoApi = async () => {
        //Datasource List 호출
        axios.post('/api/DataSource?type=info', {
            is_Dscode: this.state.before_dscode,
        })
        .then( response => {
            try {
                this.setState({ responseDataSourceInfo: response });
                this.setState({ append_DataSourceInfo: this.DsSourceInfoAppend() });

                $('#is_Ds_dbname').val(this.state.ds_dbname)
                $('#is_Ds_cdm_version').val(this.state.ds_cdm_version)
                $('#is_Ds_holdorg').val(this.state.ds_holdorg)
                $('#startday_val').val(this.state.ds_startdate)
                $('#endday_val').val(this.state.ds_enddate)
                $('#is_Ds_patnt_count').val(this.state.ds_patnt_count)
                $('#is_Ds_db_location').val(this.state.ds_db_location)
                $('#is_Ds_comments').val(this.state.ds_comments)
                $('#is_Ds_db_type').val(this.state.ds_data_type)
                
                $('#upload_img').prepend('<img id="uploadimg" src="'+this.state.file+'"/>')
                $('#upload_img').prepend('<input id="is_MainImg" type="hidden" name="is_MainImg" value="'+this.state.fileName+'"}/>')
                
                $('#upload_img2').prepend('<img id="uploadimg2" src="'+this.state.file2+'"/>')
                $('#upload_img2').prepend('<input id="is_LabelImg" type="hidden" name="is_LabelImg" value="'+this.state.fileName2+'"}/>')
                
                $('#imagefile').val(this.state.fileName)
                $('#imagefile2').val(this.state.fileName2)

                if($('#uploadimg').attr('src') == ''){
                    $('#uploadimg').hide()
                    $('#uploadimg2').hide()
                }
                if(this.state.ds_type != ''){
                    $('.'+this.state.ds_type).prop("checked", true)
                }
            } catch (error) {
                this.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기')
            }
        })
        .catch( response => {return false;} );
    }

    // SW Tool 정보 append
    DsSourceInfoAppend = () => {
        let result = []
        var DsSourceInfo = this.state.responseDataSourceInfo.data
        
            if(this.state.before_dscode != 'register'){
                var data = DsSourceInfo.json[0]

                var date =data.ds_start_date
                var year = date.substr(0,4)
                var month = date.substr(4,2)
                var day = date.substr(6,2)
                this.state.ds_startdate = year+month+day

                date = data.ds_end_date
                year = date.substr(0,4)
                month = date.substr(4,2)
                day = date.substr(6,2)
                this.state.ds_enddate = year+month+day

                this.state.ds_dbname = data.ds_dbname
                this.state.ds_cdm_version = data.ds_cdm_version
                this.state.ds_holdorg = data.ds_holdorg
                this.state.ds_patnt_count = data.ds_patnt_count
                this.state.ds_db_location = data.ds_db_location
                this.state.ds_comments = data.ds_comments
                this.state.ds_data_type = data.ds_data_type
                this.state.ds_type = data.ds_type
                
                this.state.file = '/image/'+data.ds_big_imgpath
                this.state.fileName = data.ds_big_imgpath
                $('#imagefile').val(data.ds_big_imgpath)
                $('#uploadimg').show()
                this.state.file2 = '/image/'+data.ds_imagepath
                this.state.fileName2 = data.ds_imagepath
                $('#imagefile2').val(data.ds_imagepath)
                $('#uploadimg2').show()

            }
            result.push(
                <table className="table_ty1">
                    <tr>
                        <th>
                            <label for="is_Ds_dbname">Data source명<span className="red">(*)</span></label>
                        </th>
                        <td>
                            <input type="text" name="is_Ds_dbname" id="is_Ds_dbname" className="" />
                        </td>
                    </tr>
                    <tr>
                        <th>
                            <label for="">구분<span className="red">(*)</span></label>
                        </th>
                        <td>
                            <ul className="check_ty1">
                                {this.state.append_DatasourceType}
                            </ul>
                        </td>
                    </tr>
                    <tr>
                        <th>
                            <label for="">CDM 버전<span className="red">(*)</span></label>
                        </th>
                        <td>
                            <input type="text" name="is_Ds_cdm_version" id="is_Ds_cdm_version" className="" />
                        </td>
                    </tr>
                    <tr>
                        <th>
                            <label for="">보유기관<span className="red">(*)</span></label>
                        </th>
                        <td>
                            <input type="text" name="is_Ds_holdorg" id="is_Ds_holdorg" className="" />
                        </td>
                    </tr>
                    <tr>
                        <th>
                            <label for="">데이터 기간<span className="red">(*)</span></label>
                        </th>
                        <td className="cal_box cal_box_admin">
                            <input  id="startday_val" type="text" name="is_Startday" readOnly/>
                            <label className="cal_i" htmlFor="" onClick={(e) => this.showCalendar('#layer_pop', 'first', e)} ><img src={require("../../img/sub/cal_i.png")} alt=""/> ~</label>
                            <input  id="endday_val" type="text" name="is_Endday" readOnly/>
                            <label className="cal_i" htmlFor="" onClick={(e) => this.showCalendar('#layer_pop', 'first',e)}><img src={require("../../img/sub/cal_i.png")} alt=""/></label>
                        </td>
                    </tr>
                    <tr>
                        <th>
                            <label for="">환자 수</label>
                        </th>
                        <td>
                            <input type="text" name="is_Ds_patnt_count" id="is_Ds_patnt_count" className="" />
                        </td>
                    </tr>
                    <tr>
                        <th>
                            <label for="">위치</label>
                        </th>
                        <td>
                            <input type="text" name="is_Ds_db_location" id="is_Ds_db_location" className="" />
                        </td>
                    </tr>
                    <tr>
                        <th>
                            <label for="">Data type</label>
                        </th>
                        <td>
                            <input type="text" name="is_Ds_db_type" id="is_Ds_db_type" className="" />
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
                            <label for="wr_content">설명<span className="red">(*)</span></label>
                        </th>
                        <td>
                            <textarea name="is_Ds_comments" id="is_Ds_comments" rows="" cols=""></textarea>
                        </td>
                    </tr>
                </table>
            )
        return result
    }

    //업로드할 파일 세팅
    handleFileInput(type, e){
        var id = e.target.id
        if(type =='file'){
            $('#imagefile').val(e.target.files[0].name)
        }else if(type =='file2'){
            $('#imagefile2').val(e.target.files[0].name)
        }
        this.setState({
          selectedFile : e.target.files[0],
        })

        setTimeout(function() {
            this.handlePostImage(type, id ,e)
        }.bind(this),1
        );
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

    // 저장 버튼 클릭시 validate check
    submitClick = async (type, e) => {
        this.Ds_dbname_checker = $('#is_Ds_dbname').val();
        this.Ds_type_checker = $("input[name='is_Ds_type']:checked").val();
        this.state.dstypecd = this.Ds_type_checker
        $('#is_Ds_typecd').val(this.state.dstypecd)
        this.Ds_cdm_version_checker = $('#is_Ds_cdm_version').val();
        this.Ds_holdorg_checker = $('#is_Ds_holdorg').val();
        this.Startday_checker = $('#startday_val').val();
        this.Endday_checker = $('#endday_val').val();
        this.Ds_patnt_count_checker = $('#is_Ds_patnt_count').val();
        this.Ds_db_location_checker = $('#is_Ds_db_location').val();
        this.Ds_comments_checker = $('#is_Ds_comments').val();


        this.fnValidate = (e) => {
            
            // ## Ds_dbname check start 
            if(this.Ds_dbname_checker === '') {
                $('#is_Ds_dbname').addClass('border_validate_err');
                this.sweetalert('Data source명을 다시 확인해주세요.', '', 'info', '닫기')
                return false;
            }
            $('#is_Ds_dbname').removeClass('border_validate_err');

            // ## Ds_type check start 
            if(this.Ds_type_checker === undefined) {
                this.sweetalert('구분을 선택해주세요.', '', 'info', '닫기')
                return false;
            }

            // ## Ds_cdm_version check start 
            if(this.Ds_cdm_version_checker === '') {
                $('#is_Ds_cdm_version').addClass('border_validate_err');
                this.sweetalert('CDM 버전을 다시 확인해주세요.', '', 'info', '닫기')
                return false;
            }
            $('#is_Ds_cdm_version').removeClass('border_validate_err');

            // ## Ds_holdorg check start 
            if(this.Ds_holdorg_checker === '') {
                $('#is_Ds_holdorg').addClass('border_validate_err');
                this.sweetalert('보유기관을 다시 확인해주세요.', '', 'info', '닫기')
                return false;
            }
            $('#is_Ds_holdorg').removeClass('border_validate_err');

            // ## Startday check start 
            if(this.Startday_checker === '') {
                $('#startday_val').addClass('border_validate_err');
                this.sweetalert('데이터 기간을 다시 확인해주세요.', '', 'info', '닫기')
                return false;
            }
            $('#startday_val').removeClass('border_validate_err');

            // ## Endday check start
            if(this.Endday_checker === '') {
                $('#endday_val').addClass('border_validate_err');
                this.sweetalert('데이터 기간을 다시 확인해주세요.', '', 'info', '닫기')
                return false;
            }
            $('#endday_val').removeClass('border_validate_err');

            var pattern1 = /^[0-9]+$/;	// 숫자만
            // ## Ds_patnt check start 
            if(this.Ds_patnt_count_checker !== '') {
                if(!pattern1.test(this.Ds_patnt_count_checker)) {
                    $('#is_Ds_patnt_count').addClass('border_validate_err');
                    this.sweetalert('환자 수는 숫자만 입력가능합니다.', '', 'info', '닫기')
                    return false; 
                }
            }
            $('#is_Ds_patnt_count').removeClass('border_validate_err');

            // ## Ds_comments check start 
            if(this.Ds_comments_checker === '') {
                $('#is_Ds_comments').addClass('border_validate_err');
                this.sweetalert('설명을 다시 확인해주세요.', '', 'info', '닫기')
                return false;
            }
            $('#is_Ds_comments').removeClass('border_validate_err');

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
            this.state.dscode = 'DS'+y_str+m_str+d_str+hour+min+sec
            
            $('#is_Dscode').val(this.state.dscode)

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
                const response = await fetch('/api/DataSource?type='+type, {
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
                        this.sweetalertSucc('Datasource 등록이 완료되었습니다.', false)
                        this.saveLogMessage('LG10','Datasource를 등록했습니다. Datasource 명 : '+this.Ds_dbname_checker+' 관리자 계정 : '+this.state.admin_userid)
                    }else if(type == "modify"){
                        this.sweetalertSucc('Datasource 수정이 완료되었습니다.', false)
                        this.saveLogMessage('LG10','Datasource를 수정했습니다. Datasource 명 : '+this.Ds_dbname_checker+' 관리자 계정 : '+this.state.admin_userid)
                    }

                    const response = await axios.get('/api/cmpathinfo');
                    window.location.href = response.data.home_url+'/AdminDataSourceList';
                }else{
                    this.sweetalert('작업중 오류가 발생하였습니다.', '', 'error', '닫기')
                }  
            } catch (error) {
                this.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기')
            }
        }//fnValidate end

    };

    // 날짜선택 레이어 팝업에서 날짜 선택하면 연구기간에 value값 세팅
    onCalChange = (str_date, end_date) => {
        var y_str = str_date.getFullYear().toString();
        var month = str_date.getMonth()+1
        if(month < 10) month = '0' + month
        var m_str = month.toString();
        var day = str_date.getDate()
        if(day < 10) day = '0' + day
        var d_str = day.toString();
        $('#startday_val').val(y_str+m_str+d_str)
        this.state.calender_click_show = true

        if(end_date != undefined){
            var y_end = end_date.getFullYear().toString();
            var month = end_date.getMonth()+1
            if(month < 10) month = '0' + month
            var m_end = month.toString();
            var day = end_date.getDate()
            if(day < 10) day = '0' + day
            var d_end = day.toString();
            $('#endday_val').val(y_end+m_end+d_end)
            $('.layer_Close').trigger('click');
            this.state.calender_click_show = false
        }
    }

    //  달력 이미지 클릭시 달력 레이어 팝업 노출
    showCalendar = (href, type, e) => {
        e.preventDefault();

        this.state.calender_click_show = true

        var $href = href
        var el = href

        $('.picker__trigger').hide();
        $('.range-picker-input__icon').hide();            
        $('.picker-input__text').trigger('click');

        var $el = $(el);        //레이어의 id를 $el 변수에 저장
        $el.fadeIn();
        
        var $elWidth = ~~($el.outerWidth()),
            $elHeight = ~~($el.outerHeight()),
            docWidth = $(document).width(),
            docHeight = $(document).height();
            
        // 화면의 중앙에 레이어를 띄운다.
        if ($elHeight < docHeight || $elWidth < docWidth) {
            $el.css({
                marginTop: -$elHeight /2,
                marginLeft: -$elWidth/2
            })
        } else {
            $el.css({top: 0, left: 0});
        }

        $el.find('a.layer_Close').click(function(){
            $el.fadeOut();
        });

    }

    //화면 클릭이벤트 감지
    clickdetect = (e) => {
        if(this.state.calender_click_show){
            this.state.calender_click_show = false
        }else{
            if(e.target.id != 'left-arrow' && e.target.id != 'right-arrow' && e.target.className != 'calendar__head--title'){
                $('.layer_Close').trigger('click');
                this.state.calender_click_show = true
            }
        }
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
            <section className="sub_wrap" onClick={(e) => this.clickdetect(e)}>
            <article className="s_cnt mp_pro_li ct1">
                <div className="li_top">
                    <h2 className="s_tit1">Data Sources 등록/수정</h2>
                </div>
                <div className="bo_w re1_wrap re1_wrap_writer">
                    <form name="frm" id="frm" action="" onsubmit="" method="post" >
                        <input id="is_Dscode" type="hidden" name="is_Dscode" value={this.state.dscode} />
                        <input id="is_beforeDscode" type="hidden" name="is_beforeDscode" value={this.state.before_dscode} />
                        <input id="is_Ds_typecd" type="hidden" name="is_Ds_typecd" value={this.state.dstypecd} />
                        <input id="is_Email" type="hidden" name="is_Email" value={this.state.admin_userid} />
                        <article className="res_w">
                            <p className="ment" style={{"text-align": "right"}}>
                                <span className="red">(*)</span>표시는 필수입력사항 입니다.
                            </p>
                            <div className="tb_outline">
                                {this.state.append_DataSourceInfo}
                                <div className="btn_confirm mt20" style={{"margin-bottom": "44px"}}>
                                    <Link to={'/AdminDataSourceList'} className="bt_ty bt_ty1 cancel_ty1">취소</Link>
                                    <a href="javascript:" className="bt_ty bt_ty2 submit_ty1 saveclass" onClick={(e) => this.submitClick('save', e)}>저장</a>
                                    <a href="javascript:" className="bt_ty bt_ty2 submit_ty1 modifyclass" onClick={(e) => this.submitClick('modify', e)}>수정</a>
                                </div>
                            </div>
                        </article>
                    </form>	
                    {/* 날짜선택 레이어 팝업 */}  
                    <div id="layer_pop" className="pop-layer2" style={{zIndex:2}}>
                        <div className="pop-container">
                            <div className="pop-conts">
                                <div style={{ height: "347px", width:"600px" }}>
                                    <RangeDatePicker
                                        onChange = {this.onCalChange}
                                        />
                                </div>
                                <div className="btn-r">
                                    <a href="" className="layer_Close">Close</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> 
            </article>
        </section>
        );
    }
}

export default DataSourceView;