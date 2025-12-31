import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { SubSink } from 'subsink';
import { appIconVM } from '../shared/models/appIconVM';
import { AppIconService } from '../shared/services/app-icon.service';
import { loginDetailsVM } from '../shared/models/loginDetailsVM';
import { privilagesVM } from '../shared/models/privilagesVM';
import { LocalStorageService } from '../shared/services/local-storage.service';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdAccountServiceService } from '../shared/services/ad-account-service.service';
import { ADAccountVM } from '../shared/models/adAccountVM';
import { MessageService } from 'primeng/api';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { FileUploadService } from '../shared/services/file-upload.service';

@Component({
  selector: 'app-rapid-system',
  templateUrl: './rapid-system.component.html',
  styleUrls: ['./rapid-system.component.css']
})
export class RapidSystemComponent implements OnInit, OnDestroy {
  selectedModuleEnum : number = 1;
  private subs = new SubSink();
  appIcons : appIconVM[]=[]
  loginForm !: FormGroup;
  passwordChangeForm !: FormGroup;
  isLoading : boolean = false;
  imageChangedEvent: any = '';
  isCropOpen : boolean = false
  croppedImage: string = '';
  isUpdating : boolean = false;
  isProfileOpen:boolean = false;
  isPasswordChangeOpen: boolean = false;
  logedDetails : loginDetailsVM | undefined;
  adAccount : ADAccountVM | undefined;
  privilages : privilagesVM[] = [];
  name : string | undefined;
  usercode : string ='';
  isPasswordCorrect : boolean = false
  activeStepIndex : number = 0;
  newlySvedProfilePictureName : string = ''
  joinedDate = new Date()
  profilePictureName : string = ''
  steps = [
    { label: 'Verify Password'},
    { label: 'Change Password'}
  ];

  @Output() isLogout = new EventEmitter<boolean>();

  get getLoginPassword(): AbstractControl { return this.loginForm.get('password') as AbstractControl; }
  get getNewPassword(): AbstractControl { return this.passwordChangeForm.get('newPassword') as AbstractControl; }
  get getConfirmPassword(): AbstractControl { return this.passwordChangeForm.get('confirmPassword') as AbstractControl; }

  constructor(
    private formBuilder: FormBuilder,
    private appIconService : AppIconService, 
    private localStorageService : LocalStorageService,
    private adAccountService : AdAccountServiceService,
    private router : Router,
    private messageService: MessageService,
    private fileUploadService : FileUploadService
  ){}

  changeModule(moduleEnum : number=0 , appIconeName : string = ''){
    this.selectedModuleEnum = moduleEnum;
    this.router.navigate([`/${appIconeName}`]);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  ngOnInit(): void {
    this.getLoginData()
    this.buildForms()
    this.isLogout.emit(false);
  }

  buildForms(){
    this.loginForm = this.formBuilder.group({
      password : ['',Validators.required]
    })

    this.passwordChangeForm = this.formBuilder.group({
      newPassword : ['',Validators.required],
      confirmPassword : ['',Validators.required]
    })
  }

  getLoginData(){
    let loginData : any = this.localStorageService.getItem('login');
    this.logedDetails = JSON.parse(loginData)
    this.privilages = this.logedDetails?.privilagesDTO ? this.logedDetails?.privilagesDTO : [];
    this.name = this.logedDetails?.fullName.split(" ")[0];
    this.usercode = this.logedDetails?.usercode ? this.logedDetails?.usercode : '';
    this.profilePictureName = this.logedDetails?.profilePictureName ? this.logedDetails?.profilePictureName : '';
    this.getAppIcons()
  }

  getJoinedDate(date : string) : string{
    let enrolmentDate : string;
    enrolmentDate = date.split("T")[0];
    return enrolmentDate;
  }

  getAppIcons() {
    this.isLoading = true;
    
    this.subs.sink = this.appIconService.getAppIcons().subscribe({
      next: (data) => {
        if (data && data.content) {
          this.appIcons = data.content;
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
      
        if (error.status === 403) {
          this.logout()
        } else {
          console.log('API error occurred:', error);
        }
      }
    });
  }

  changePassword(){
    this.isUpdating = true;
    let newPassword : string = this.getNewPassword.value;
    let confirmPassword : string = this.getConfirmPassword.value;
    let ad : ADAccountVM | undefined;

    if(newPassword === confirmPassword){
      ad = {
        ...this.adAccount,
        passWord : confirmPassword
      }

      this.subs.sink = this.adAccountService.updateUserAccount(ad).subscribe(data => {
        if(data && data.content){
          this.isUpdating = false;
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Password Updated' });
        }
      });

    }else{
      this.isUpdating = false;
      this.messageService.add({ severity: 'warn', summary: 'Faild', detail: 'Password mismatch' });
    }

  }

  closePassWordChangePopup(){
    this.isPasswordChangeOpen = false;
    this.activeStepIndex = 0;
  }

  closeProfilePopup(){
    this.isProfileOpen = false
  }

  checkPassword(){
    this.isLoading = true;
    let loginDetails : ADAccountVM;

    loginDetails = {
      userCode : this.usercode,
      passWord : this.getLoginPassword.value
    }
    

    this.subs.sink = this.adAccountService.getALogin(loginDetails).subscribe(data =>{
      if(data && data.content){
        this.adAccount = data.content;
        this.isPasswordCorrect = true;

        if(this.isPasswordCorrect){
          this.activeStepIndex = this.activeStepIndex+1;
        }
        
        this.isLoading = false;
      }else{
        this.isLoading = false;
        this.messageService.add({ severity: 'warn', summary: 'Faild', detail: 'Wrong Password' });
      }
    })
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
    this.isCropOpen = true
  }

  imageCropped(event: ImageCroppedEvent): void {
    this.croppedImage = event.base64!;
  }

  reset(){
    this.loginForm.reset();
    this.passwordChangeForm.reset()
  }

  uploadCroppedImage(): void {
    const blob = this.dataURItoBlob(this.croppedImage);
    const file = new File([blob], 'cropped-image.png', { type: 'image/png' });
  
    const formData = new FormData();
    formData.append('file', file);

    this.fileUploadService.uploadImageFile(formData).subscribe({
      next: (data) => {
        if (data && data.code && data.code === "00") {
          this.newlySvedProfilePictureName = data.content ? data.content : ''
          this.uploadProfilePicture()
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Upload success' });
        } else {
          this.messageService.add({ severity: 'error', summary: 'Success', detail: 'Upload unsuccess' });
        }
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Success', detail: 'Upload unsuccess - Large file size' });
      }
    });
    
  }

  uploadProfilePicture(){
    this.adAccountService.updateProfilePicture(this.newlySvedProfilePictureName,this.usercode).subscribe(data =>{
      if(data && data.content){
        if(this.logedDetails){
          this.logedDetails = {
            ...this.logedDetails,
            profilePictureName : this.newlySvedProfilePictureName
          }

          this.localStorageService.removeItem('login');
          this.localStorageService.setItem('login',JSON.stringify(this.logedDetails));
          this.closeProfilePopup()
          window.location.reload();
        }
      }
    })
  }

  dataURItoBlob(dataURI: string): Blob {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ab], { type: mimeString });
  }

  closeCrop(){
    this.croppedImage = ''
    this.imageChangedEvent=''
  }

  openPasswordChange(){
    this.isPasswordChangeOpen = true;
  }

  openProfile(){
    this.isProfileOpen = true;
  }

  isAllowed(appIconId : number = 0):boolean{
    if(this.privilages.filter(el => el && el.appIcon && el.appIcon.id == appIconId).length > 0){
      return true;
    }else{
      return false;
    }
  }

  logout(){
    this.localStorageService.removeItem('login')
    this.localStorageService.removeItem('token')
    this.isLogout.emit(true);
    this.router.navigate(['login']);
  }
}
