/**
 * @since  : 2019.08.20
 * @auther : 이정열
 * @file_Comment : Mysql api get/post 테스트
 * ----------------------
 * 개정이력
 * 2019.08.20 : 최초작성
 */

import React, { Component } from 'react';
import { RangeDatePicker } from '@y0c/react-datepicker';
// import '@y0c/react-datepicker/assets/styles/calendar.scss';
import "dayjs/locale/ko";
import "../css/red.scss";


class App extends Component {
  state = {
    response: '',
    post: '',
    is_Username: '',
    responseToPost: '',
    appendHtml: '',
    selectedFile: null,
  };
  
  //페이지 로드시 실행 GET TEST
  componentDidMount() {
    this.callApi()
      .then(res => this.setState({ response: res.express }))
      .catch(err => console.log(err));
  }
  
  callApi = async () => {
    const response = await fetch('/api/getUser/1?type=login');
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    
    return body;
  };
  
  // summit 버튼 클릭시 실행 POST TEST
  handleSubmit = async e => {
    e.preventDefault();
    const response = await fetch('/api/postTest?type=login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ is_Username: this.state.is_Username}),
    });
    
    const body = await response.json();
    // 리턴값이 TEXT일 경우 사용 : const body = await response.text();    

    for(var i=0; i<body.json.length; i++){
      console.log("  CONSOLE LOG IN BODY : "+body.json[i].username)
    }
    this.setState({ responseToPost: body });
    this.setState({ appendHtml: this.createTable() });
    
  };
  // Mysql 결과 ArrayList 출력 함수
  createTable = () => {
    let table = []
        // Outer loop to create parent
    for(let i=0; i<this.state.responseToPost.json.length; i++){
      table.push(<p>USERNAME : {this.state.responseToPost.json[i].username}  
      || USEREMAIL : {this.state.responseToPost.json[i].useremail}
      || USERMAJOR : {this.state.responseToPost.json[i].usermajor}
      || USERPHONE : {this.state.responseToPost.json[i].userphone}
      }</p>)
    }
    return table
  }

  onChangeHandler=event=>{

    // console.log(event.target.files[0])
    this.setState({
      selectedFile: event.target.files[0],
      loaded: 0,
    })

  }   
  
render() {
    return (
      // <div className="App">
      //   <header className="App-header">
      //   </header>
      //   <p>{this.state.response}</p>
      //   <form onSubmit={this.handleSubmit}>
      //     <p>
      //       <strong>성함을 입력하세요.</strong>
      //     </p>
      //     <input
      //       type="text"
      //       value={this.state.is_Username}
      //       onChange={e => this.setState({ is_Username: e.target.value })}
      //     />
      //     <button type="submit">Submit</button>
      //   </form>
      //     {this.state.appendHtml}
      //  </div>
        // <div style={{ height: "400px" }}>
        //     <RangeDatePicker />
        // </div>
        <input type="file" name="file" onChange={this.onChangeHandler}/>
    );
  }
}

export default App;