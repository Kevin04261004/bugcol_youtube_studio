export const getFrameRate=()=>{const value=Number(document.getElementById('frameRate')?.value);return value===60?60:30;};
export function installFrameRateControl(){
 const resolution=document.getElementById('resolution');
 if(!resolution||document.getElementById('frameRate'))return;
 const label=document.createElement('label');label.textContent='프레임레이트 ';
 const select=document.createElement('select');select.id='frameRate';select.innerHTML='<option value="30">30 FPS · 기본</option><option value="60">60 FPS · 부드러운 움직임</option>';
 label.append(select);resolution.closest('label')?.after(label);
}
installFrameRateControl();
