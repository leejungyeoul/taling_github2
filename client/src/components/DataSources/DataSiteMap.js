/*
    맵에 대한 funcion 수정 및 기존의 high chart 플러그인을
    react highchart로 변경해야함
*/
import React, { Component } from 'react';
import $ from 'jquery';
import ReactHighcharts from 'react-highcharts';

class DataSiteMap extends Component {
    constructor(props) {
        super(props);

        this.state = {
            
        }
    }
    
    sel_sca(sca){
        $("#sca").val(sca);
    }
    sel_area(area, no){
        var s_img = "../../img/sub/map_0"+no+".jpg";
        $("#sel_map").attr("src",s_img);
        this.sel_submit(area, no);
        console.log('area: '+area+" no: "+no);
    }
    sel_area2(area, no){
        $("#sca").val(area);
        var s_img = "../../img/sub/map_0"+no+".jpg";
        $("#sel_map").attr("src",s_img);
        console.log('area: '+area+" no: "+no);
    }
    sel_area3(){
        $("#stx2").val("");
        var s_img = "../../img/sub/map_00.jpg";
        $("#sel_map").attr("src",s_img);
    }
    sel_submit(area, no){
        // var f = document.fsearch;
        // f.stx.value = '';
        // f.sca.value = area;
        // f.submit();
    }


    render () {
        const temp_style = {
            minWidth: '310px',
            height: '229px',
            margin: '0 auto',
        }
        return (
            <section className="sub_wrap" >
                <article className="s_cnt mp_pro_li ct1">
                    <div className="li_top">
                        <h2 className="s_tit1">Data Source Map</h2>
                    </div>
                    <div className="sw_view">
                        <div className="map_box">
                            <div className="l_map">
                                <h4 className="title_ty1">Map</h4>
                                <div className="map_all">
                                    <img className="main_map" src={require("../../img/sub/map_00.jpg")} alt="" useMap="#Map" id="sel_map"/>
                                    <map name="Map" id="Map">
                                        <area shape="poly" coords="85,232,86,237,89,242,95,245,98,245,103,242,106,238,106,234,101,231,95,229,88,229,86,231,85,232" href={this.sel_area('광주','3')} onMouseEnter={this.sel_area2('광주','3')} onMouseOut={this.sel_area3()}  alt="광주" />
                                        <area shape="poly" coords="74,221,68,235,61,238,53,237,53,244,58,249,48,257,48,267,53,273,56,278,52,284,48,289,46,300,51,303,66,294,66,286,77,287,85,292,104,292,109,295,117,287,130,285,135,281,127,272,135,268,143,273,146,269,144,264,149,264,149,251,147,243,139,243,138,232,133,227,133,223,126,225,120,227,117,224,109,229,101,219,93,217,86,229,79,228,75,221" href={this.sel_area('전남','1')} onMouseEnter={this.sel_area2('전남','1')} onMouseOut={this.sel_area3()}  alt="전남" />
                                        <area shape="poly" coords="103,172,96,182,90,183,86,186,80,183,85,198,82,203,75,209,75,219,80,226,83,228,90,225,92,221,97,219,101,219,106,224,109,228,113,228,116,227,121,225,122,227,124,227,127,225,129,225,132,224,134,224,137,224,139,224,141,220,141,217,138,209,137,201,138,198,141,195,146,194,147,192,150,191,152,188,150,184,149,181,144,180,139,178,135,182,132,183,128,184,126,180,123,176,121,173,119,174,118,175,115,177,111,181,111,182,109,184,106,179,106,174,105,170,100,177"href={this.sel_area('전북','2')} onMouseEnter={this.sel_area2('전북','2')} onMouseOut={this.sel_area3()} alt="전북" />
                                        <area shape="poly" coords="183,267,176,262,170,259,166,261,162,262,160,266,157,268,154,266,151,265,150,263,149,259,149,253,148,247,146,243,140,244,139,238,137,228,136,224,137,223,139,222,141,218,140,214,138,206,138,198,143,195,150,192,154,192,159,195,166,203,171,205,178,206,193,210,204,209,206,208,207,207,209,213,216,220,216,222,211,227,205,231,200,233,201,239,194,238,184,241,183,247,184,249,194,245,200,243,203,246,200,250,196,248,194,249,198,257,194,260,191,265,185,266,183,266" href={this.sel_area('경남','4')} onMouseEnter={this.sel_area2('경남','4')} onMouseOut={this.sel_area3()} alt="경남" />
                                        <area shape="poly" coords="176,206,169,206,163,201,160,196,155,193,151,190,151,186,150,183,149,181,150,180,154,177,158,173,160,169,158,167,155,165,150,162,149,160,150,156,151,154,152,151,150,147,151,144,152,142,155,138,160,136,162,132,163,130,167,127,170,128,173,129,176,130,177,131,179,131,180,129,180,127,181,124,181,121,184,117,186,115,189,114,193,115,198,115,201,115,206,113,209,113,212,114,217,114,220,113,221,110,224,106,227,114,230,120,231,127,232,137,231,144,228,155,228,162,230,173,231,180,234,178,236,175,237,174,239,177,239,181,237,186,234,192,234,197,233,205,234,207,228,205,223,203,218,201,213,202,210,207,204,208,201,210,196,211,189,210,184,208,188,199,193,195,196,191,199,187,197,184,195,182,192,181,189,181,186,184,182,187,179,187,177,190,177,195,178,201,177,205,176,206,172,205" href={this.sel_area('경북','5')} onMouseEnter={this.sel_area2('경북','5')} onMouseOut={this.sel_area3()} alt="경북" />
                                        <area shape="poly" coords="176,201,177,188,187,182,197,183,189,197,183,204,174,203" href={this.sel_area('대구','6')} onMouseEnter={this.sel_area2('대구','6')} onMouseOut={this.sel_area3()} alt="대구" />
                                        <area shape="poly" coords="207,205,215,218,221,218,227,223,236,205,217,201,203,204" href={this.sel_area('울산','7')} onMouseEnter={this.sel_area2('울산','7')} onMouseOut={this.sel_area3()} alt="울산" />
                                        <area shape="poly" coords="177,21,168,35,159,30,150,40,135,37,123,44,115,34,112,42,125,56,131,62,127,74,137,80,152,82,142,87,143,99,143,109,151,107,150,95,154,102,164,101,179,108,185,112,217,110,223,103,205,71,189,51,183,47,184,40,178,31,177,19" href={this.sel_area('강원','8')} onMouseEnter={this.sel_area2('강원','8')} onMouseOut={this.sel_area3()} alt="강원" />
                                        <area shape="poly" coords="200,246,193,244,182,248,182,239,194,237,201,237,200,231,215,224,222,216,231,223,220,229,220,235,202,245" href={this.sel_area('부산','9')} onMouseEnter={this.sel_area2('부산','9')} onMouseOut={this.sel_area3()} alt="부산" />
                                        <area shape="poly" coords="70,330,59,327,60,317,73,313,97,310,105,323,71,330" href={this.sel_area('제주','10')} onMouseEnter={this.sel_area2('제주','10')} onMouseOut={this.sel_area3()} alt="제주" />
                                        <area shape="poly" coords="139,179,131,160,125,149,123,138,126,129,125,122,142,108,157,107,170,102,186,111,179,128,162,127,149,141,151,161,160,171,148,180,139,178" href={this.sel_area('충북','11')} onMouseEnter={this.sel_area2('충북','11')} onMouseOut={this.sel_area3()} alt="충북" />
                                        <area shape="poly" coords="132,161,125,173,119,164,119,153,108,133,121,131,105,120,87,118,67,118,58,139,70,159,87,178,103,179,107,171,112,181,123,173,132,179,137,177,133,160" href={this.sel_area('충남','12')} onMouseEnter={this.sel_area2('충남','12')} onMouseOut={this.sel_area3()} alt="충남" />
                                        <area shape="poly" coords="121,139,111,132,107,146,116,155,126,150,120,137" href={this.sel_area('세종','13')} onMouseEnter={this.sel_area2('세종','13')} onMouseOut={this.sel_area3()} alt="세종" />
                                        <area shape="poly" coords="247,127,240,116,251,108,268,123,246,128" href={this.sel_area('울릉도','14')} onMouseEnter={this.sel_area2('울릉도','14')} onMouseOut={this.sel_area3()} alt="울릉도" />
                                        <area shape="poly" coords="130,163,130,151,120,149,116,165,126,171,131,165" href={this.sel_area('대전','15')} onMouseEnter={this.sel_area2('대전','15')} onMouseOut={this.sel_area3()} alt="대전" />
                                        <area shape="poly" coords="94,87,108,92,113,79,105,67,92,85" href={this.sel_area('서울','16')} onMouseEnter={this.sel_area2('서울','16')} onMouseOut={this.sel_area3()} alt="서울" />
                                        <area shape="poly" coords="90,77,80,80,76,63,62,73,52,106,65,112,82,101,90,89,91,77" href={this.sel_area('인천','17')} onMouseEnter={this.sel_area2('인천','17')} onMouseOut={this.sel_area3()} alt="인천" />
                                        <area shape="poly" coords="95,80,85,78,78,74,88,66,90,60,88,52,97,54,92,44,112,40,120,47,133,64,134,79,147,80,141,90,141,101,138,111,117,119,116,127,107,120,100,123,85,108,89,90,93,87,113,93,114,79,105,70,96,79" href={this.sel_area('경기','18')} onMouseEnter={this.sel_area2('경기','18')} onMouseOut={this.sel_area3()} alt="경기" />
                                    </map>
                                    
                                    {/* <ReactHighcharts config={map1}></ReactHighcharts> */}
                                </div>

                            </div>
                            <div className="r_map">
                                <h4 className="title_ty1">병원A</h4>
                                <table className="table_ty1">
                                    <tbody>
                                        <tr>
                                            <th>방문건수 : <span className="blue_c	">12.2M</span></th>
                                            <th>진단건수 : <span className="blue_c	">18.5M</span></th>
                                            <th>처방건수 : <span className="blue_c	">77.1M</span></th>
                                            <th>수술건수 : <span className="blue_c	">42.1M</span></th>
                                        </tr>
                                    </tbody>
                                </table>	
                                {/* <!-- 임시 플러그인입니다. 그래프 개발이 어려울시 플러그인 교체해도 무방 https://www.highcharts.com/demo -->
                                <!-- 플러그인 스크립트는 하단에 있음 --> */}
                                <div id="container" style={temp_style}>
                                </div>

                                <h4 className="title_ty1 mt40">병원B</h4>
                                <table className="table_ty1">
                                    <tbody>
                                        <tr>
                                            <th>방문건수 : <span className="blue_c	">12.2M</span></th>
                                            <th>진단건수 : <span className="blue_c	">18.5M</span></th>
                                            <th>처방건수 : <span className="blue_c	">77.1M</span></th>
                                            <th>수술건수 : <span className="blue_c	">42.1M</span></th>
                                        </tr>
                                    </tbody>
                                </table>	
                                <div id="container2" style={temp_style}>
                                </div>

                                <h4 className="title_ty1 mt40">병원B</h4>
                                <table className="table_ty1">
                                    <tbody>
                                        <tr>
                                            <th>방문건수 : <span className="blue_c	">12.2M</span></th>
                                            <th>진단건수 : <span className="blue_c	">18.5M</span></th>
                                            <th>처방건수 : <span className="blue_c	">77.1M</span></th>
                                            <th>수술건수 : <span className="blue_c	">42.1M</span></th>
                                        </tr>
                                    </tbody>
                                </table>	
                                <div id="container3" style={temp_style}>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="btn_confirm mt20">
                        <a href="#n" className="bt_ty bt_ty2 submit_ty1">목록</a>
                    </div>


                </article>
            </section>
        );
    }
}

export default DataSiteMap;