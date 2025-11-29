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
import { TeacehrQuizReportVM } from 'src/app/shared/models/teacherQuizReportVM';
import { AttemptService } from 'src/app/shared/services/attempt.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { ReportTypeMappingService } from 'src/app/shared/services/report-type-mapping.service';

@Component({
  selector: 'app-income-report',
  templateUrl: './income-report.component.html',
  styleUrls: ['./income-report.component.css']
})
export class IncomeReportComponent implements OnInit, OnChanges {

  
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
  incomeReportData : IncomeReportVM[]=[]
  incomeReportDataAll : IncomeReportVM[]=[]
  pdfData : PageWiseDataVM[]=[]
  classFeeChartData : chartVM|undefined
  basicOptions: any;
  loggedUserId : number = 0
  totalIncome : number =0;
  monthlyIncomeData : IncomeReportVM[] = []


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
    
  getReportData(year : number = this.thisYear){
    this.attemptService.getIncomeReportData(year).subscribe(data =>{
      if(data && data.content){
        this.incomeReportData = data.content;
        this.incomeReportDataAll = this.incomeReportData;
        this.findMonthlyTotalIncome()
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

    this.incomeReportData.forEach((element,index) => {
      let eleNo : number = index + 1;
      this.totalIncome = this.totalIncome + element.total

      if(eleNo<=len){
        if(eleNo % 15 > 0){
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

    if(len<=14){
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

  findMonthlyTotalIncome(){
    let obj : IncomeReportVM

    let janAmount : number = 0;
    let febAmount : number = 0;
    let marAmount : number = 0;
    let aprAmount : number = 0;
    let mayAmount : number = 0;
    let junAmount : number = 0;
    let julAmount : number = 0;
    let augAmount : number = 0;
    let sepAmount : number = 0;
    let octAmount : number = 0;
    let novAmount : number = 0;
    let decAmount : number = 0;

    this.incomeReportData.forEach(element => {
      janAmount = janAmount + element.janAmount
      febAmount = febAmount + element.febAmount
      marAmount = marAmount + element.marAmount
      aprAmount = aprAmount + element.aprAmount
      mayAmount = mayAmount + element.mayAmount
      junAmount = junAmount + element.junAmount
      julAmount = julAmount + element.julAmount
      augAmount = augAmount + element.augAmount
      sepAmount = sepAmount + element.sepAmount
      octAmount = octAmount + element.octAmount
      novAmount = novAmount + element.novAmount
      decAmount = decAmount + element.decAmount
    });

    obj = {
      descriptiopn : 'Total',
      janAmount :janAmount, 
      febAmount :febAmount,
      marAmount :marAmount,
      aprAmount :aprAmount,
      mayAmount :mayAmount,
      junAmount :junAmount,
      julAmount :julAmount,
      augAmount :augAmount,
      sepAmount :sepAmount,
      octAmount :octAmount,
      novAmount :novAmount,
      decAmount :decAmount,
      total : janAmount+febAmount+marAmount+aprAmount+mayAmount+junAmount+julAmount+augAmount+sepAmount+octAmount+novAmount+decAmount
    }

    this.monthlyIncomeData.push(obj)
    
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
    let filteredStudentQuizReportData : IncomeReportVM[]=[]
    this.incomeReportDataAll.forEach(element => {
      this.selectedCourses.forEach(ele => {
        if(element.descriptiopn == ele.code){
          filteredStudentQuizReportData.push(element)
        }
      });
    });
    
    this.incomeReportData = filteredStudentQuizReportData;
    this.setPDFData()

  }

  getMarlAsPrecentage(mark : number=0 , noOfQuestions : number=1){
    return (mark/noOfQuestions)*100;
  }

}
