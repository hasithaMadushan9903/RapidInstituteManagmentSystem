import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { chartVM } from 'src/app/shared/models/chartVM';
import { CourseVM } from 'src/app/shared/models/coursesVM';
import { dataSetsVM } from 'src/app/shared/models/dataSetsVM';
import { loginDetailsVM } from 'src/app/shared/models/loginDetailsVM';
import { PageWiseDataVM } from 'src/app/shared/models/pageWiseDataVM';
import { privilagesVM } from 'src/app/shared/models/privilagesVM';
import { reportTypesVM } from 'src/app/shared/models/ReportTypesVM';
import { TeacehrQuizReportVM } from 'src/app/shared/models/teacherQuizReportVM';
import { AttemptService } from 'src/app/shared/services/attempt.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { ReportTypeMappingService } from 'src/app/shared/services/report-type-mapping.service';

@Component({
  selector: 'app-teacehr-quiz-report',
  templateUrl: './teacehr-quiz-report.component.html',
  styleUrls: ['./teacehr-quiz-report.component.css']
})
export class TeacehrQuizReportComponent  implements OnInit, OnChanges {

  @Input() reciptTemplateDataVM : reportTypesVM | undefined;
  @Input() selectedCourses : CourseVM[] = []
  @Input() isGetPDFClicked : boolean | undefined ;
  @Output() isPdfCreated = new EventEmitter<boolean>();
  
  
  userCode : string = ''
  date = new Date;
  logedDetails : loginDetailsVM | undefined;
  privilages : privilagesVM[] = [];
  userRoleId : number = 0
  reportTypes : reportTypesVM[]=[];
  teacherQuizReportData : TeacehrQuizReportVM[]=[]
  teacherQuizReportDataAll : TeacehrQuizReportVM[]=[]
  pdfData : PageWiseDataVM[]=[]
  classFeeChartData : chartVM|undefined
  basicOptions: any;
  loggedUserId : number = 0
  highest : TeacehrQuizReportVM | undefined;
  lowest : TeacehrQuizReportVM | undefined;


  constructor(
      private attemptService : AttemptService,
      private reportTypeMappingService : ReportTypeMappingService,
      private localStorageService : LocalStorageService,
  ){}


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isGetPDFClicked']) {
      this.isGetPDFClicked = changes['isGetPDFClicked'].currentValue;
  
      this.getLoginData();
      this.subscription();
  
      if (this.isGetPDFClicked) {
        this.generatePDF();
      }
    }
  
    if (changes['reciptTemplateDataVM']) {
      this.reciptTemplateDataVM = changes['reciptTemplateDataVM'].currentValue;
    }

    if(changes['selectedCourses']){
      this.selectedCourses = changes['selectedCourses'].currentValue;
      this.filterByCourse()
    }
    
  }

  ngOnInit(): void {
    // this.getLoginData()
    // this.subscription()
  }

  subscription(){
    this.reportTypeMappingService.getReportsUnderRole(this.userRoleId).subscribe(data =>{
      if(data && data.content){
        data.content.forEach(element => {
          this.reportTypes.push(element.reportTypes);
        });
        
      }
    })

    this.getReportData()
  }

  generatePDF(): void {
    const containers = document.querySelectorAll('.receipt-container');
    const pdf = new jsPDF();
    const promises: Promise<void>[] = [];
  
    containers.forEach((container, index) => {
      const promise = html2canvas(container as HTMLElement, { scale: 2 }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
  
        if (index > 0) pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, 0, 211, 298);
      });
  
      promises.push(promise);
    });
  
    Promise.all(promises).then(() => {
      const blob = pdf.output('blob');
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl);
    });

    this.isPdfCreated.emit(false)
  }
    
  getReportData(){
    this.attemptService.getTeacherQuizReportData(this.loggedUserId).subscribe(data =>{
      if(data && data.content){
        this.teacherQuizReportData = data.content;
        this.teacherQuizReportDataAll = this.teacherQuizReportData;
        this.highest = this.teacherQuizReportData[0];
        this.lowest = this.teacherQuizReportData[0];
        this.setPDFData()
        
      }
    })
  }

  setPDFData(){
    
    let reportTypesVM : TeacehrQuizReportVM[]=[]
    let pageno : number = 1;
    let pdfdataset : PageWiseDataVM[]=[]
    let pdfdata : PageWiseDataVM
    let len = this.teacherQuizReportData.length;

    this.teacherQuizReportData.forEach((element,index) => {
      let eleNo : number = index + 1;


      if(eleNo<=len){
        if(eleNo % 7 > 0){
          reportTypesVM.push(element)
        }else{
          pdfdata = {
            page : pageno,
            teacherData : reportTypesVM
          }

          pdfdataset.push(pdfdata)
          reportTypesVM =[];
          pageno = pageno +1;

          reportTypesVM.push(element)
          if(len==eleNo){
            pdfdata = {
              page : pageno,
              teacherData : reportTypesVM
            }
  
            pdfdataset.push(pdfdata)
            this.pdfData = pdfdataset
            reportTypesVM =[];
  
          }
        }
      }else{
        this.pdfData = pdfdataset
      }
    });

    if(len<=6){
      pdfdata = {
        page : pageno,
        teacherData : reportTypesVM
      }

      pdfdataset.push(pdfdata)
      this.pdfData = pdfdataset
      reportTypesVM =[];

    }
    
    this.setChartData()
  }

  setChartData(){
    let dataset : dataSetsVM
    let data : number[]=[];
    let labels : string[]=[]

    this.teacherQuizReportData.forEach(element => {
      data.push(element.averageMarks)
      labels.push(element.quizName);
    });

    dataset = {
      label : 'Quiz Average Marks Evelution',
      data : data,
      backgroundColor : ['rgba(75, 192, 192)','rgba(75, 192, 192)','rgba(75, 192, 192)','rgba(75, 192, 192)',
                         'rgba(75, 192, 192)','rgba(75, 192, 192)','rgba(75, 192, 192)','rgba(75, 192, 192)',
                         'rgba(75, 192, 192)','rgba(75, 192, 192)','rgba(75, 192, 192)','rgba(75, 192, 192)'
                        ],
      
    }

    this.classFeeChartData = {
      labels : labels,
      datasets : [dataset]
    }

    this.basicOptions = {
      plugins: {
          legend: {
              labels: {
                  color: 'black',
                  font: {
                    size: 25 
                  }
              }
          }
      },
      scales: {
          y: {
              beginAtZero: true,
              ticks: {
                  color: 'black'
              },
              grid: {
                  drawBorder: false
              }
          },
          x: {
              ticks: {
                  color: 'black'
              },
              grid: {
                  drawBorder: false
              },

              barThickness: 2
          }
      }
    };
  }

  getLoginData(){
    let loginData : any = this.localStorageService.getItem('login');
    this.logedDetails = JSON.parse(loginData)
    this.loggedUserId = this.logedDetails?.id ? this.logedDetails.id : 0;
    this.userCode = this.logedDetails?.usercode ? this.logedDetails?.usercode : ''
    
    switch(this.userCode[0]){
      case 'S' : 
        this.userRoleId = 1
        break;
      case 'F' :
        this.userRoleId = 2
        break;
      case 'A' :
        this.userRoleId = 5
        break;
      case 'T' :
        this.userRoleId = 4
        break;
      case 'M' :
        this.userRoleId = 3
        break;
    }
    
    this.privilages = this.logedDetails?.privilagesDTO ? this.logedDetails?.privilagesDTO : [];
  }

  filterByCourse(){
    let filteredStudentQuizReportData : TeacehrQuizReportVM[]=[]
    this.teacherQuizReportDataAll.forEach(element => {
      this.selectedCourses.forEach(ele => {
        if(element.courseCode == ele.code){
          filteredStudentQuizReportData.push(element)
        }
      });
    });
    
    this.teacherQuizReportData = filteredStudentQuizReportData;
    this.setPDFData()

  }

  getMarlAsPrecentage(mark : number=0 , noOfQuestions : number=1){
    return (mark/noOfQuestions)*100;
  }

}


