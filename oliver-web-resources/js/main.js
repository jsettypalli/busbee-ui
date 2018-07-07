
function openNav() {
    if (document.documentElement.clientWidth > 1200) {
        document.getElementById("left-panel").style.width = "250px";
        document.getElementById("men").style.fontSize = "20px";
        document.getElementById("routh1").style.width = "32%" ;
        document.getElementById("routh2").style.width = "32%";
        document.getElementById("routh3").style.width = "32%";
        document.getElementById("routh4").style.width = "32%";
        document.getElementById("routh1").style.marginLeft= "2%";
        document.getElementById("routh2").style.marginLeft = "10%";
        document.getElementById("routh3").style.marginLeft= "2%";
        document.getElementById("routh4").style.marginLeft = "10%";
        document.getElementById("open").style.opacity ="0";
        document.getElementById("open").style.marginLeft ="0";
        document.getElementById("close").style.fontSize ="24px";
        document.getElementById("close").style.marginLeft ="75px";
        document.getElementById("head").style.paddingLeft = "250px";
        document.getElementById("breadcrumb").style.paddingLeft = "20px";
    }else{
        document.getElementById("left-panel").style.width = "250px";
        document.getElementById("men").style.fontSize = "20px";
        document.getElementById("routh1").style.width = "225px";
        document.getElementById("routh2").style.width = "225px";
        document.getElementById("routh3").style.width = "225px";
        document.getElementById("routh4").style.width = "225px";
        document.getElementById("open").style.opacity ="0";
        document.getElementById("open").style.marginLeft ="0";
        document.getElementById("close").style.fontSize ="24px";
        document.getElementById("close").style.marginLeft ="75px";
        document.getElementById("head").style.paddingLeft = "250px";
        document.getElementById("breadcrumb").style.paddingLeft = "20px";
    }
   
}

function closeNav() {
    if (document.documentElement.clientWidth > 1200) {
    document.getElementById("left-panel").style.width = "0";
    document.getElementById("men").style.fontSize = "0px";
    document.getElementById("routh1").style.width = "38%";
    document.getElementById("routh2").style.width = "38%";
    document.getElementById("routh3").style.width = "38%";
    document.getElementById("routh4").style.width = "38%";
    document.getElementById("routh1").style.marginLeft= "2%";
    document.getElementById("routh2").style.marginLeft = "13%";
    document.getElementById("routh3").style.marginLeft= "2%";
    document.getElementById("routh4").style.marginLeft = "13%";
    document.getElementById("close").style.fontSize ="0px";
    document.getElementById("open").style.opacity ="1";
    document.getElementById("open").style.marginLeft ="95px";
    document.getElementById("head").style.paddingLeft = "35px";
    document.getElementById("breadcrumb").style.paddingLeft = "35px";
    }else{
        document.getElementById("left-panel").style.width = "0";
        document.getElementById("men").style.fontSize = "0px";
        document.getElementById("routh1").style.width = "38%";
        document.getElementById("routh2").style.width = "38%";
        document.getElementById("routh3").style.width = "38%";
        document.getElementById("routh4").style.width = "38%";
        document.getElementById("routh1").style.marginLeft= "20px";
        document.getElementById("routh2").style.marginLeft = "120px";
        document.getElementById("routh3").style.marginLeft= "20px";
        document.getElementById("routh4").style.marginLeft = "120px";
        document.getElementById("close").style.fontSize ="0px";
        document.getElementById("open").style.opacity ="1";
        document.getElementById("open").style.marginLeft ="95px";
        document.getElementById("head").style.paddingLeft = "35px";
        document.getElementById("breadcrumb").style.paddingLeft = "35px";
    }
}

