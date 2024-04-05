const timeArea=document.querySelector('#timearea');

//function to fetch the time and put it in the page
function gettime(){
  const date=new Date();
  const hours=date.getHours().toString().padStart(2,"0");
  const minutes=date.getMinutes().toString().padStart(2,"0");
  const seconds=date.getSeconds().toString().padStart(2,"0");
  //put it in the page
  timeArea.textContent=`${hours}:${minutes}:${seconds}`;
  console.log(`${hours}:${minutes}:${seconds}`);
}
//set interval to call it every 500ms (can be done 1000ms but more accuracy)\
setInterval(gettime,500);
//call the function as soon as the page lands
gettime();