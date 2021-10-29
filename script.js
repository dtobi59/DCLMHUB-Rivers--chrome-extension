var screen = document.getElementById("screen");

document.addEventListener("DOMContentLoaded", () => {
    var button = document.getElementById("extract")
   
    button.addEventListener("click", (e) => {
      console.log("Extract button clicked")
      info("Please wait...");
      hookExtractor();
    })

    
})

function hookExtractor() {
    // chrome.tabs.executeScript(() => {
    //   chrome.tabs.executeScript({ file: "extractor.js" })
    // })
    
    chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
        var tab = tabs[0];
        var el = document.body.querySelector("style[type='text/css'], style:not([type])");

        chrome.tabs.executeScript(tab.id, {
            code: 'document.querySelector("tbody[role=alert]").innerHTML'
          }, dom_content);
    });
}

function to_json(dom){
  try {    

  var rows = dom.split(/<tr class="\w+/mg)
    
  var converts = [];
  rows.forEach((item, index)=>{
    
    let row  = remove_linebreaks_ss(item);
    let columns = row.split(/<td/mg)
    //console.log(columns);
    let convert = [];

    columns.forEach((inner_item, index)=>{
      let data = inner_item.split(/class="\s+">([a-zA-Z0-9\s+\W+]+)</g)[1];
      convert.push(data);        
      
    })
    
    if(convert[5] != undefined && convert[7] != undefined ){
      converts.push({
        name: convert[5],
        phone: convert[7],
        address: convert[6],
        date: convert[9],
      })
    }    

  })

 return converts;
  } catch (error) {
    error()
    console.log(error);
    
  }
}

function http_post(data){
  fetch('https://dev-vattax.deepay.com.ng/api/converts', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-type': 'application/json; charset=UTF-8'
    }
  })
  .then(res => res.json())
  .catch(err => {
    error()
    console.log(err);
  });



}

function dom_content (results){
    let dom = remove_linebreaks_ss(results)

    let data = to_json(dom);

    console.log(data);

    http_post(data);

    success("Completed! "+data.length +" Convert(s) recorded.")   

}

function remove_linebreaks_ss( str ) {
    var newstr = "";
      
    for( var i = 0; i < str.length; i++ ) 
        if( !(str[i] == '\n' || str[i] == '\r') )
                newstr += str[i];
                  
    return newstr;
} 

function error(){
  info("An Error Occured, try again! Note: contact tech team if issue persist, thank you.")   
}

function info(message){
  screen.innerText  = message
  screen.style.color = "red";
}

function success(message){
  screen.innerText  = message
  screen.style.color = "green";
}

