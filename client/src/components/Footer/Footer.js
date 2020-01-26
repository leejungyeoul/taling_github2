import React, { Component } from 'react';
import $ from 'jquery';

class Footer extends Component {
    constructor (props) {
      super(props);
      
      this.state = {
      }
  }

  componentDidMount() {
    $('.priv').click(function(){
      $('.pop_layout').fadeIn()
      $("html").css("overflow","hidden")
      $("body").css("overflow","hidden")
      $('.pop_cnt').hide()
      $('.pop_pri').show()
    })
    $('.em_bt').click(function(){
      $('.pop_layout').fadeIn()
      $("html").css("overflow","hidden")
      $("body").css("overflow","hidden")
      $('.pop_cnt').hide()
      $('.pop_email').show()
    })
    $('.btn_close').click(function(){
      $('.pop_layout').fadeOut();
      $("html").css("overflow","visible");
      $("body").css("overflow","visible");
      $('.pop_cnt').hide();
    });
  }

  render () {
    return (
        <footer className="footer">
            <ul>
              <li className="priv"><a href="#n">개인정보처리방침</a></li>
              <li className="em_bt"><a href="#n">이메일주소무단수집거부</a></li>
            </ul>
            <div className="ft_p">
              <span>주소 : {this.props.footer_address}</span>
              <span>Tel : {this.props.footer_tel}</span>
              {/* <span>Email : {props.footer_email}</span> */}
              {/* <span>Mobile : {props.footer_mobile}</span> */}
            </div>
            <p>COPYRIGHT &copy; 2019 RT-ROD, ALL RIGHTS RESERVED.{this.props.name}</p>
        </footer>
    );
  }
}

export default Footer;