import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { chartVM } from 'src/app/shared/models/chartVM';
import { CourseVM } from 'src/app/shared/models/coursesVM';
import { dataSetsVM } from 'src/app/shared/models/dataSetsVM';
import { IncomeReportDataForFrontdeskOfficerVM } from 'src/app/shared/models/IncomeReportDataForFrontdeskOfficerVM';
import { IncomeReportVM } from 'src/app/shared/models/incomeReportVM';
import { loginDetailsVM } from 'src/app/shared/models/loginDetailsVM';
import { PageWiseDataVM } from 'src/app/shared/models/pageWiseDataVM';
import { privilagesVM } from 'src/app/shared/models/privilagesVM';
import { reportTypesVM } from 'src/app/shared/models/ReportTypesVM';
import { TeacehrQuizReportVM } from 'src/app/shared/models/teacherQuizReportVM';
import * as moment from 'moment';
import { AttemptService } from 'src/app/shared/services/attempt.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { ReportTypeMappingService } from 'src/app/shared/services/report-type-mapping.service';

@Component({
  selector: 'app-front-desk-income-report',
  templateUrl: './front-desk-income-report.component.html',
  styleUrls: ['./front-desk-income-report.component.css']
})
export class FrontDeskIncomeReportComponent {

  @Input() reciptTemplateDataVM : reportTypesVM | undefined;
  @Input() selectedCourses : CourseVM[] = []
  @Input() isGetPDFClicked : boolean | undefined ;
  @Output() isPdfCreated = new EventEmitter<boolean>();
  
  
  userCode : string = ''
  isPDFProcesing : boolean = false;
  date = new Date;
  fromDate = new Date;
  thisYear = this.date.getFullYear();
  logedDetails : loginDetailsVM | undefined;
  privilages : privilagesVM[] = [];
  userRoleId : number = 0
  reportTypes : reportTypesVM[]=[];
  incomeReportDataForFrontdeskOfficer : IncomeReportDataForFrontdeskOfficerVM[]=[]
  incomeReportDataForFrontdeskOfficerAll : IncomeReportDataForFrontdeskOfficerVM[]=[]
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
        this.isPDFProcesing = true
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
    this.isPDFProcesing = true
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
    this.isPDFProcesing = false
    this.isPdfCreated.emit(false)
  }
    
  getReportData(){
    this.attemptService.GetIncomeReportDataForFrontdeskOfficer(0,0).subscribe(data =>{
      if(data && data.content){
        this.incomeReportDataForFrontdeskOfficerAll = data.content;;
        this.incomeReportDataForFrontdeskOfficer = this.incomeReportDataForFrontdeskOfficerAll.filter(
          el => el && el.payedDate && moment(el.payedDate, "YYYY-MM-DD HH:mm:ss.SSSSSS")
          && moment().year() && moment(el.payedDate, "YYYY-MM-DD HH:mm:ss.SSSSSS").year()
          &&  moment().year() == moment(el.payedDate, "YYYY-MM-DD HH:mm:ss.SSSSSS").year()
        )
        
        this.setPDFData()
      }
    })
  }


  setPDFData(){
      
      let reportTypesVM : IncomeReportDataForFrontdeskOfficerVM[]=[]
      let pageno : number = 1;
      let pdfdataset : PageWiseDataVM[]=[]
      let pdfdata : PageWiseDataVM
      let len = this.incomeReportDataForFrontdeskOfficer.length;
  
      this.incomeReportDataForFrontdeskOfficer.forEach((element,index) => {
        let eleNo : number = index + 1;
  
  
        if(eleNo<=len){
          if(eleNo % 7 > 0){
            reportTypesVM.push(element)
          }else{
            pdfdata = {
              page : pageno,
              incomeReportDataForFrontdeskOfficerVM : reportTypesVM
            }
  
            pdfdataset.push(pdfdata)
            reportTypesVM =[];
            pageno = pageno +1;
  
            reportTypesVM.push(element)
            if(len==eleNo){
              pdfdata = {
                page : pageno,
                incomeReportDataForFrontdeskOfficerVM : reportTypesVM
              }
    
              pdfdataset.push(pdfdata)
              this.pdfData = pdfdataset
              reportTypesVM =[];
    
            }
          }

          if(eleNo == len){
            this.pdfData = pdfdataset
          }
        }else{
          this.pdfData = pdfdataset
        }
      });
  
      if(len<=6){
        pdfdata = {
          page : pageno,
          incomeReportDataForFrontdeskOfficerVM : reportTypesVM
        }
  
        pdfdataset.push(pdfdata)
        this.pdfData = pdfdataset
        reportTypesVM =[];
  
      }
      
      this.setChartData()
    }

  // setPDFData(){
    
  //   let reportTypesVM : IncomeReportDataForFrontdeskOfficerVM[]=[]
  //   let pageno : number = 1;
  //   let pdfdataset : PageWiseDataVM[]=[]
  //   let pdfdata : PageWiseDataVM
  //   let len = this.incomeReportDataForFrontdeskOfficer.length;

  //   this.incomeReportDataForFrontdeskOfficer.forEach((element,index) => {
  //     let eleNo : number = index + 1;
  //     // this.totalIncome = this.totalIncome + element.total

  //     if(eleNo<=len){
  //       if(eleNo % 11 > 0){
  //         reportTypesVM.push(element)
  //       }else{
  //         pdfdata = {
  //           page : pageno,
  //           incomeReportDataForFrontdeskOfficerVM : reportTypesVM
  //         }

  //         pdfdataset.push(pdfdata)
  //         reportTypesVM =[];
  //         pageno = pageno +1;

  //         reportTypesVM.push(element)
  //         if(len==eleNo){
  //           pdfdata = {
  //             page : pageno,
  //             incomeReportDataForFrontdeskOfficerVM : reportTypesVM
  //           }
  
  //           pdfdataset.push(pdfdata)
  //           this.pdfData = pdfdataset
  //           reportTypesVM =[];
  
  //         }
  //       }
  //     }else{
  //       this.pdfData = pdfdataset
  //     }
  //   });

  //   if(len<=10){
  //     pdfdata = {
  //       page : pageno,
  //       incomeReportDataForFrontdeskOfficerVM : reportTypesVM
  //     }

  //     pdfdataset.push(pdfdata)
  //     this.pdfData = pdfdataset
  //     reportTypesVM =[];

  //   }
    
  //   this.setChartData()
  // }

  setChartData(){
    let dataset : dataSetsVM
    let data : number[]=[];
    let labels : string[]=[]

    this.incomeReportDataForFrontdeskOfficer.forEach(element => {
      // data.push(element.total)
      // labels.push(element.descriptiopn);
    });

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
    let filteredIncomeReportDataForFrontdeskOfficer : IncomeReportDataForFrontdeskOfficerVM[]=[]
    this.incomeReportDataForFrontdeskOfficerAll.forEach(element => {
      this.selectedCourses.forEach(ele => {
        if(element.courseCode == ele.code){
          filteredIncomeReportDataForFrontdeskOfficer.push(element)
        }
      });
    });
    
    this.incomeReportDataForFrontdeskOfficer = filteredIncomeReportDataForFrontdeskOfficer;
    this.setPDFData()

  }

  getMarlAsPrecentage(mark : number=0 , noOfQuestions : number=1){
    return (mark/noOfQuestions)*100;
  }

}
