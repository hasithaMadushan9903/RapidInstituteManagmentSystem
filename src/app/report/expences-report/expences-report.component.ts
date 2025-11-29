import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
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
import { AttemptService } from 'src/app/shared/services/attempt.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { ReportTypeMappingService } from 'src/app/shared/services/report-type-mapping.service';

@Component({
  selector: 'app-expences-report',
  templateUrl: './expences-report.component.html',
  styleUrls: ['./expences-report.component.css']
})
export class ExpencesReportComponent implements OnInit, OnChanges {
 
  @Input() reciptTemplateDataVM : reportTypesVM | undefined;
  @Input() selectedCourses : CourseVM[] = []
  @Input() selectedYear : Date | undefined;
  @Input() isGetPDFClicked : boolean | undefined ;
  @Output() isPdfCreated = new EventEmitter<boolean>();
  
  
  userCode : string = ''
  date = new Date;
  janFirst = new Date(new Date().getFullYear(), 0, 1);
  fromDate : Date | undefined
  toDate : Date | undefined
  thisYear = this.date.getFullYear();
  selectedYearOnly : number = this.date.getFullYear();
  logedDetails : loginDetailsVM | undefined;
  privilages : privilagesVM[] = [];
  userRoleId : number = 0
  reportTypes : reportTypesVM[]=[];
  incomeReportData : IncomeReportVM[]=[]
  incomeReportDataAll : IncomeReportVM[]=[]
  pdfData : PageWiseDataVM[]=[]
  classFeeChartData : chartVM|undefined
  basicOptions: any;
  loggedUserId : number = 0
  totalIncome : number =0;
  restDateText = 'Dec 31, '


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
      // this.filterByCourse()
    }

    if(changes['selectedYear']){
      this.selectedYear = changes['selectedYear'].currentValue;
      this.checkFromDate()
      this.getReportData(this.selectedYear?.getFullYear())
      this.selectedYearOnly = this.selectedYear?.getFullYear() ? this.selectedYear?.getFullYear() : this.date.getFullYear();
      this.getToDtae()
      
    }
    
  }

  checkFromDate(){
    if(this.selectedYear?.getFullYear() == this.date.getFullYear() && 
        this.selectedYear.getMonth() == this.date.getMonth() &&
        this.selectedYear.getDate() == this.date.getDate()){
          this.fromDate =  this.janFirst
    }else{
      this.fromDate =  this.selectedYear
    }
  }

  getToDtae(){
    let returnDate: Date = this.selectedYear ? this.selectedYear :this.date
    if(this.selectedYearOnly === this.thisYear){
      returnDate.setMonth(11); // 0-based index, so 5 = June
      returnDate.setDate(31)
    }

    return returnDate
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
    
  getReportData(year : number = this.thisYear){
    this.attemptService.getExpencesReportData(year).subscribe(data =>{
      if(data && data.content){
        this.incomeReportData = data.content;
        this.incomeReportDataAll = this.incomeReportData;
        this.setPDFData()
        
      }
    })
  }

  setPDFData(){
    
    let reportTypesVM : IncomeReportVM[]=[]
    let pageno : number = 1;
    let pdfdataset : PageWiseDataVM[]=[]
    let pdfdata : PageWiseDataVM
    let len = this.incomeReportData.length;
    this.totalIncome = 0

    this.incomeReportData.forEach((element,index) => {
      let eleNo : number = index + 1;
      this.totalIncome = this.totalIncome + element.total

      if(eleNo<=len){
        if(eleNo % 11 > 0){
          reportTypesVM.push(element)
        }else{
          pdfdata = {
            page : pageno,
            incomeData : reportTypesVM
          }

          pdfdataset.push(pdfdata)
          reportTypesVM =[];
          pageno = pageno +1;

          reportTypesVM.push(element)
          if(len==eleNo){
            pdfdata = {
              page : pageno,
              incomeData : reportTypesVM
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
        incomeData : reportTypesVM
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

    this.incomeReportData.forEach(element => {
      data.push(element.total)
      labels.push(element.descriptiopn);
    });

    dataset = {
      label : 'Expenses Evelution',
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

  // filterByCourse(){
  //   let filteredStudentQuizReportData : IncomeReportVM[]=[]
  //   this.incomeReportDataAll.forEach(element => {
  //     this.selectedCourses.forEach(ele => {
  //       if(element.descriptiopn == ele.code){
  //         filteredStudentQuizReportData.push(element)
  //       }
  //     });
  //   });
    
  //   this.incomeReportData = filteredStudentQuizReportData;
  //   this.setPDFData()

  // }

  getMarlAsPrecentage(mark : number=0 , noOfQuestions : number=1){
    return (mark/noOfQuestions)*100;
  }

}
