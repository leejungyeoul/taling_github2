import React, { Component } from 'react';
import $ from 'jquery';
import axios from "axios";
import Swal from 'sweetalert2'

class MyProject_sitepop extends Component {
    constructor (props) {
        super(props);
        
        this.state = {
            pjtcode : props.match.params.pjtcode,
            swt_code : props.match.params.swt_code,
        }
    }
    componentDidMount() {
        axios.post('/api/Swtool?type=geturl', {
            is_Pjtcode: this.state.pjtcode,
            is_Swtcode: this.state.swt_code,
        })
        .then( response => {
            var url = response.data.json[0].usw_url
            if(url == undefined || url ==''){
                this.sweetalert('선택하신 Software tool의 URL이 존재하지 않습니다.', '', 'info', '닫기')
                tmp_this = this
                setTimeout(function() {
                    tmp_this.props.history.goBack();
                    }.bind(tmp_this),1000
                );
                return false;
            }else{
                //운영
                document.getElementById("loadiframe").src=url
                //로컬
                // document.getElementById("loadiframe").src="http://127.0.0.1:6956"
                
                var tmp_this = this
                $(document).bind('keydown',function(e){
                    if ( e.keyCode == 123 /* F12 */) {
                        e.preventDefault();
                        tmp_this.sweetalert('개발자도구를 사용할 수 없습니다.', '', 'info', '닫기');
                        e.returnValue = false;
                    }
                });
                document.onmousedown=disableclick;
        
                function disableclick(event){
                    if (event.button==2) {
                        tmp_this.sweetalert('보안상의 이유로 오른쪽 마우스를 사용할 수 없습니다.', '', 'info', '닫기');
                        return false;
                    }
                }
            }
        })
        .catch( error => {this.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기');return false;} );

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

    render () {
        return (
            <section className="sub_wrap" >
               
            <iframe id="loadiframe" width="100%" height="2000px" >
                <p>Your browser does not support iframes.</p>
            </iframe>
            </section>
        );
    }
}

export default MyProject_sitepop;