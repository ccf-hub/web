
var rec;
var recOpen=function(success){//一般在显示出录音按钮或相关的录音界面时进行此方法调用，后面用户点击开始录音时就能畅通无阻了
    rec=Recorder({
        type:"mp3",sampleRate:16000,bitRate:16 //mp3格式，指定采样率hz、比特率kbps，其他参数使用默认配置；注意：是数字的参数必须提供数字，不要用字符串；需要使用的type类型，需提前把格式支持文件加载进来，比如使用wav格式需要提前加载wav.js编码引擎
        ,onProcess:function(buffers,powerLevel,bufferDuration,bufferSampleRate){
        }
    });

    rec.open(function(){//打开麦克风授权获得相关资源
        
        success&&success();
    },function(msg,isUserNotAllow){//用户拒绝未授权或不支持
        console.log((isUserNotAllow?"UserNotAllow，":"")+"无法录音:"+msg);
    });
};

/**开始录音**/
function recStart(){//打开了录音后才能进行start、stop调用
    rec.start();
};

/**结束录音**/
function recStop(){
    rec.stop(function(blob,duration){
        console.log(blob,(window.URL||webkitURL).createObjectURL(blob),"时长:"+duration+"ms");
        rec.close();//释放录音资源，当然可以不释放，后面可以连续调用start；但不释放时系统或浏览器会一直提示在录音，最佳操作是录完就close掉
        rec=null;
        
        
        /*立即播放例子*/
        var audio=document.createElement("audio");
        audio.controls=true;
        audio.className='audio';
        document.getElementById('massge').appendChild(audio);
        //简单的一哔，注意不用了时需要revokeObjectURL，否则霸占内存
        audio.src=(window.URL||webkitURL).createObjectURL(blob);
        audio.play();
    },function(msg){
        console.log("录音失败:"+msg);
        rec.close();//可以通过stop方法的第3个参数来自动调用close
        rec=null;
    });
};
