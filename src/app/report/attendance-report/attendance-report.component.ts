import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { chartVM } from 'src/app/shared/models/chartVM';
import { CourseVM } from 'src/app/shared/models/coursesVM';
import { dataSetsVM } from 'src/app/shared/models/dataSetsVM';
import { IncomeReportVM } from 'src/app/shared/models/incomeReportVM';
import { loginDetailsVM } from 'src/app/shared/models/loginDetailsVM';
import { PageWiseDataVM } from 'src/app/shared/models/pageWiseDataVM';
import { privilagesVM } from 'src/app/shared/models/privilagesVM';
import { reportTypesVM } from 'src/app/shared/models/ReportTypesVM';
import { StudentAttendnceReportDataVM } from 'src/app/shared/models/studentAttendanceReportDataVM';
import { AttemptService } from 'src/app/shared/services/attempt.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { ReportTypeMappingService } from 'src/app/shared/services/report-type-mapping.service';

@Component({
  selector: 'app-attendance-report',
  templateUrl: './attendance-report.component.html',
  styleUrls: ['./attendance-report.component.css']
})
export class AttendanceReportComponent {

  
  @Input() reciptTemplateDataVM : reportTypesVM | undefined;
  @Input() selectedCourses : CourseVM[] = []
  @Input() isGetPDFClicked : boolean | undefined ;
  @Output() isPdfCreated = new EventEmitter<boolean>();
  
  
  userCode : string = ''
  date = new Date;
  fromDate = new Date;
  thisYear = this.date.getFullYear();
  logedDetails : loginDetailsVM | undefined;
  privilages : privilagesVM[] = [];
  userRoleId : number = 0
  reportTypes : reportTypesVM[]=[];
  studentAttendanceReportData : StudentAttendnceReportDataVM[]=[]
  studentAttendanceReportDataAll : StudentAttendnceReportDataVM[]=[]
  pdfData : PageWiseDataVM[]=[]
  classFeeChartData : chartVM|undefined
  basicOptions: any;
  loggedUserId : number = 0
  totalIncome : number =0;


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
          let rep : number;
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
    
  getReportData(year : number = this.thisYear){
    this.attemptService.getStudentAttendanceReportData(this.loggedUserId,year).subscribe(data =>{
      if(data && data.content){
        this.studentAttendanceReportData = data.content;
        this.studentAttendanceReportDataAll = this.studentAttendanceReportData;
        
        this.setPDFData()
      }
    })
  }

  setPDFData(){
    
    let reportTypesVM : StudentAttendnceReportDataVM[]=[]
    let pageno : number = 1;
    let pdfdataset : PageWiseDataVM[]=[]
    let pdfdata : PageWiseDataVM
    let len = this.studentAttendanceReportData.length;

    this.studentAttendanceReportData.forEach((element,index) => {
      let eleNo : number = index + 1;

      if(eleNo<=len){
        if(eleNo % 11 > 0){
          reportTypesVM.push(element)
        }else{
          pdfdata = {
            page : pageno,
            studentAttendanceData : reportTypesVM
          }

          pdfdataset.push(pdfdata)
          reportTypesVM =[];
          pageno = pageno +1;

          reportTypesVM.push(element)
          if(len==eleNo){
            pdfdata = {
              page : pageno,
              studentAttendanceData : reportTypesVM
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

    if(len<=10){
      pdfdata = {
        page : pageno,
        studentAttendanceData : reportTypesVM
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

    // this.studentAttendanceReportData.forEach(element => {
    //   data.push(element.total)
    //   labels.push(element.descriptiopn);
    // });

    dataset = {
      label : 'Income Evelution',
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
    let filteredStudentQuizReportData : StudentAttendnceReportDataVM[]=[]
    this.studentAttendanceReportDataAll.forEach(element => {
      this.selectedCourses.forEach(ele => {
        if(element.descriptiopn == ele.code){
          filteredStudentQuizReportData.push(element)
        }
      });
    });
    
    this.studentAttendanceReportData = filteredStudentQuizReportData;
    this.setPDFData()

  }

  getMarlAsPrecentage(mark : number=0 , noOfQuestions : number=1){
    return (mark/noOfQuestions)*100;
  }

}
