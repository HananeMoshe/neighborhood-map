function InfoBox(t){t=t||{},google.maps.OverlayView.apply(this,arguments),this.content_=t.content||"",this.disableAutoPan_=t.disableAutoPan||!1,this.maxWidth_=t.maxWidth||0,this.pixelOffset_=t.pixelOffset||new google.maps.Size(0,0),this.position_=t.position||new google.maps.LatLng(0,0),this.zIndex_=t.zIndex||null,this.boxStyle_=t.boxStyle||{},this.closeBoxMargin_=t.closeBoxMargin||"2px",this.closeBoxURL_=t.closeBoxURL||"http://www.google.com/intl/en_us/mapfiles/close.gif",""===t.closeBoxURL&&(this.closeBoxURL_=""),this.infoBoxClearance_=t.infoBoxClearance||new google.maps.Size(1,1),this.isHidden_=t.isHidden||!1,this.pane_=t.pane||"floatPane",this.div_=null,this.closeListener_=null,this.fixedWidthSet_=null}InfoBox.prototype=new google.maps.OverlayView,InfoBox.prototype.createInfoBoxDiv_=function(){var t;this.div_||(this.div_=document.createElement("div"),this.setBoxStyle_(),this.div_.style.position="absolute",this.div_.style.visibility="hidden",null!==this.zIndex_&&(this.div_.style.zIndex=this.zIndex_),this.div_.innerHTML=this.getCloseBoxImg_()+this.content_,this.getPanes()[this.pane_].appendChild(this.div_),this.addClickHandler_(),this.div_.style.width?this.fixedWidthSet_=!0:0!==this.maxWidth_&&this.div_.offsetWidth>this.maxWidth_?(this.div_.style.width=this.maxWidth_,this.div_.style.overflow="auto",this.fixedWidthSet_=!0):(t=this.getBoxWidths_(),this.div_.style.width=this.div_.offsetWidth-t.left-t.right+"px",this.fixedWidthSet_=!1),this.panBox_(this.disableAutoPan_),google.maps.event.trigger(this,"domready"))},InfoBox.prototype.getCloseBoxImg_=function(){var t="";return""!==this.closeBoxURL_&&(t="<img",t+=" src='"+this.closeBoxURL_+"'",t+=" align=right",t+=" style='",t+=" position: relative;",t+=" cursor: pointer;",t+=" margin: "+this.closeBoxMargin_+";",t+="'>"),t},InfoBox.prototype.addClickHandler_=function(){var t;""!==this.closeBoxURL_?(t=this.div_.firstChild,this.closeListener_=google.maps.event.addDomListener(t,"click",this.getCloseClickHandler_())):this.closeListener_=null},InfoBox.prototype.getCloseClickHandler_=function(){var t=this;return function(){t.close(),google.maps.event.trigger(t,"closeclick")}},InfoBox.prototype.panBox_=function(t){if(!t){var e=this.getMap(),i=e.getBounds(),o=e.getDiv(),s=o.offsetWidth,n=o.offsetHeight,h=i.toSpan(),d=h.lng(),l=h.lat(),r=d/s,a=l/n,f=i.getSouthWest().lng(),p=i.getNorthEast().lng(),_=i.getNorthEast().lat(),x=i.getSouthWest().lat(),g=this.position_,c=this.pixelOffset_.width,y=this.pixelOffset_.height,u=this.infoBoxClearance_.width,v=this.infoBoxClearance_.height,B=g.lng()+(c-u)*r,m=g.lng()+(c+this.div_.offsetWidth+u)*r,I=g.lat()-(y-v)*a,L=g.lat()-(y+this.div_.offsetHeight+v)*a,W=(f>B?f-B:0)+(m>p?p-m:0),b=(I>_?_-I:0)+(x>L?x-L:0);if(0!==b||0!==W){var w=e.getCenter();e.setCenter(new google.maps.LatLng(w.lat()-b,w.lng()-W))}}},InfoBox.prototype.setBoxStyle_=function(){var t,e=this.boxStyle_;for(t in e)e.hasOwnProperty(t)&&(this.div_.style[t]=e[t]);"undefined"!=typeof this.div_.style.opacity&&(this.div_.style.filter="alpha(opacity="+100*this.div_.style.opacity+")")},InfoBox.prototype.getBoxWidths_=function(){var t,e={top:0,bottom:0,left:0,right:0},i=this.div_;return document.defaultView&&document.defaultView.getComputedStyle?(t=i.ownerDocument.defaultView.getComputedStyle(i,""),t&&(e.top=parseInt(t.borderTopWidth,10)||0,e.bottom=parseInt(t.borderBottomWidth,10)||0,e.left=parseInt(t.borderLeftWidth,10)||0,e.right=parseInt(t.borderRightWidth,10)||0)):document.documentElement.currentStyle&&i.currentStyle&&(e.top=parseInt(i.currentStyle.borderTopWidth,10)||0,e.bottom=parseInt(i.currentStyle.borderBottomWidth,10)||0,e.left=parseInt(i.currentStyle.borderLeftWidth,10)||0,e.right=parseInt(i.currentStyle.borderRightWidth,10)||0),e},InfoBox.prototype.onRemove=function(){this.div_&&(this.div_.parentNode.removeChild(this.div_),this.div_=null)},InfoBox.prototype.draw=function(){this.createInfoBoxDiv_();var t=this.getProjection().fromLatLngToDivPixel(this.position_);this.div_.style.left=t.x+this.pixelOffset_.width+"px",this.div_.style.top=t.y+this.pixelOffset_.height+"px",this.div_.style.visibility=this.isHidden_?"hidden":"visible"},InfoBox.prototype.setOptions=function(t){"undefined"!=typeof t.boxStyle&&(this.boxStyle_=t.boxStyle,this.setBoxStyle_()),"undefined"!=typeof t.content&&this.setContent(t.content),"undefined"!=typeof t.disableAutoPan&&(this.disableAutoPan_=t.disableAutoPan),"undefined"!=typeof t.maxWidth&&(this.maxWidth_=t.maxWidth),"undefined"!=typeof t.pixelOffset&&(this.pixelOffset_=t.pixelOffset),"undefined"!=typeof t.position&&this.setPosition(t.position),"undefined"!=typeof t.zIndex&&this.setZIndex(t.zIndex),"undefined"!=typeof t.closeBoxMargin&&(this.closeBoxMargin_=t.closeBoxMargin),"undefined"!=typeof t.closeBoxURL&&(this.closeBoxURL_=t.closeBoxURL),"undefined"!=typeof t.infoBoxClearance&&(this.infoBoxClearance_=t.infoBoxClearance),"undefined"!=typeof t.isHidden&&(this.isHidden_=t.isHidden),this.div_&&this.draw()},InfoBox.prototype.setContent=function(t){this.content_=t,this.div_&&(this.closeListener_&&(google.maps.event.removeListener(this.closeListener_),this.closeListener_=null),this.fixedWidthSet_||(this.div_.style.width=""),this.div_.innerHTML=this.getCloseBoxImg_()+t,this.fixedWidthSet_||(this.div_.style.width=this.div_.offsetWidth+"px",this.div_.innerHTML=this.getCloseBoxImg_()+t),this.addClickHandler_()),google.maps.event.trigger(this,"content_changed")},InfoBox.prototype.setPosition=function(t){this.position_=t,this.div_&&this.draw(),google.maps.event.trigger(this,"position_changed")},InfoBox.prototype.setZIndex=function(t){this.zIndex_=t,this.div_&&(this.div_.style.zIndex=t),google.maps.event.trigger(this,"zindex_changed")},InfoBox.prototype.getContent=function(){return this.content_},InfoBox.prototype.getPosition=function(){return this.position_},InfoBox.prototype.getZIndex=function(){return this.zIndex_},InfoBox.prototype.show=function(){this.isHidden_=!1,this.div_.style.visibility="visible"},InfoBox.prototype.hide=function(){this.isHidden_=!0,this.div_.style.visibility="hidden"},InfoBox.prototype.open=function(t,e){e&&(this.position_=e.getPosition()),this.setMap(t),this.div_&&this.panBox_()},InfoBox.prototype.close=function(){this.closeListener_&&(google.maps.event.removeListener(this.closeListener_),this.closeListener_=null),this.setMap(null)};