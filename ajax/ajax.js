function main() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function(){
        document.getElementById("myDiv").innerHTML=xmlhttp.responseText;
    }
    xmlhttp.open("GET", "test.txt", true);
    xmlhttp.send();
}

main()