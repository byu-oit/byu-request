let rightNow = new Date()
// console.log(rightNow.getTime());
let tokenExpires = new Date(rightNow.getTime() + (5 * 1000));

tokenValid(); 
setTimeout(tokenValid, 6000);

function tokenValid() {
    let now = new Date()
    if (now.getTime() > tokenExpires.getTime()) {
        console.log(false);
        return false;
    } else {
        console.log(true);
        return true;
    }
}