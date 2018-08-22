export { detectSwipe };

function detectSwipe(id, func) {
  let swipe_det = new Object();
  swipe_det.sX = 0; swipe_det.sY = 0; swipe_det.eX = 0; swipe_det.eY = 0;
  let min_x = 30;  //min x swipe for horizontal swipe
  let max_x = 30;  //max x difference for vertical swipe
  let min_y = 50;  //min y swipe for vertical swipe
  let max_y = 60;  //max y difference for horizontal swipe
  let direc = '';
  let ele = document.getElementById(id);
  ele.addEventListener('touchstart', (e) => {
    // e.preventDefault();
    let t = e.touches[0];
    swipe_det.sX = t.screenX;
    swipe_det.sY = t.screenY;
  }, false);
  ele.addEventListener('touchmove', (e) => {
    // Might cause errors later on by giong back a page when they swipe
    // ORRRRR left swipes won't work anyways because it's a one page app...
    // OOOOORRRR it might take the back from where they found the app
    // e.preventDefault();
    let t = e.touches[0];
    swipe_det.eX = t.screenX;
    swipe_det.eY = t.screenY;
  }, false);
  ele.addEventListener('touchend', () => {
    //horizontal detection
    if((((swipe_det.eX - min_x > swipe_det.sX) || (swipe_det.eX + min_x < swipe_det.sX)) && ((swipe_det.eY < swipe_det.sY + max_y) && (swipe_det.sY > swipe_det.eY - max_y) && (swipe_det.eX > 0)))) {
      if(swipe_det.eX > swipe_det.sX) direc = 'r';
      else direc = 'l';
    }
    //vertical detection
    else if((((swipe_det.eY - min_y > swipe_det.sY) || (swipe_det.eY + min_y < swipe_det.sY)) && ((swipe_det.eX < swipe_det.sX + max_x) && (swipe_det.sX > swipe_det.eX - max_x) && (swipe_det.eY > 0)))) {
      if(swipe_det.eY > swipe_det.sY) direc = 'd';
      else direc = 'u';
    }

    if(direc !== '') {
      if(typeof func === 'function') func(id, direc);
    }
    direc = '';
    swipe_det.sX = 0; swipe_det.sY = 0; swipe_det.eX = 0; swipe_det.eY = 0;
  }, false);
}