import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { chartVM } from 'src/app/shared/models/chartVM';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { CourseVM } from 'src/app/shared/models/coursesVM';
import { loginDetailsVM } from 'src/app/shared/models/loginDetailsVM';
import { PageWiseDataVM } from 'src/app/shared/models/pageWiseDataVM';
import { privilagesVM } from 'src/app/shared/models/privilagesVM';
import { reportTypesVM } from 'src/app/shared/models/ReportTypesVM';
import { StudentQuizReportvm } from 'src/app/shared/models/studentQuizReportVM';
import { AttemptService } from 'src/app/shared/services/attempt.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { ReportTypeMappingService } from 'src/app/shared/services/report-type-mapping.service';
import { dataSetsVM } from 'src/app/shared/models/dataSetsVM';
import { managerQuizReportVM } from 'src/app/shared/models/managerQuizReportVM';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { passesGaradeVM } from 'src/app/shared/models/passesGaradeVM';

@Component({
  selector: 'app-manage-quiz-report',
  templateUrl: './manage-quiz-report.component.html',
  styleUrls: ['./manage-quiz-report.component.css']
})
export class ManageQuizReportComponent implements OnInit, OnChanges{
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
  managerQuizReportData : managerQuizReportVM[]=[]
  managerQuizReportDataAll : managerQuizReportVM[]=[]
  pdfData : PageWiseDataVM[]=[]
  classFeeChartData : chartVM|undefined
  pieChartData : chartVM|undefined
  passesCount : number[]=[]
  basicOptions: any;
  loggedUserId : number = 0
  ChartDataLabels = ChartDataLabels;
  totalQuizCount : number = 0;

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
    this.attemptService.getManagerQuizReportData().subscribe(data =>{
      if(data && data.content){
        this.managerQuizReportData = data.content;
        this.managerQuizReportDataAll = this.managerQuizReportData;
        this.managerQuizReportDataAll.forEach(element => {
          this.totalQuizCount = this.totalQuizCount + element.quizCount
        });
        
        this.setPDFData()
        
      }
    })
  }

  setPDFData(){
    
    let reportTypesVM : managerQuizReportVM[]=[]
    let pageno : number = 1;
    let pdfdataset : PageWiseDataVM[]=[]
    let pdfdata : PageWiseDataVM
    let len = this.managerQuizReportData.length;

    this.managerQuizReportData.forEach((element,index) => {
      let eleNo : number = index + 1;

      if(eleNo<=len){
        if(eleNo % 8 > 0){
          reportTypesVM.push(element)
        }else{
          pdfdata = {
            page : pageno,
            managerData : reportTypesVM
          }

          pdfdataset.push(pdfdata)
          reportTypesVM =[];
          pageno = pageno +1;

          reportTypesVM.push(element)
          if(len==eleNo){
            pdfdata = {
              page : pageno,
              managerData : reportTypesVM
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

    if(len<=7){
      pdfdata = {
        page : pageno,
        managerData : reportTypesVM
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
    let labels : string[]=['A','B','C','S','F']
    let tootalACount : number = 0
    let tootalBCount : number = 0
    let tootalCCount : number = 0
    let tootalSCount : number = 0
    let tootalFCount : number = 0
    let bgColors : string []=['#ADD8E6','#90EE90','#FFB6C1','#FFFFE0','#F08080']

    for (let index = 0; index < labels.length; index++) {
      for (let i = 0; i < this.managerQuizReportData.length; i++) {
        if(index==0){
          tootalACount = tootalACount + this.managerQuizReportData[i].noOfAPasses
        }else if(index == 1){
          tootalBCount = tootalBCount + this.managerQuizReportData[i].noOfBPasses
        }else if(index == 2){
          tootalCCount = tootalCCount + this.managerQuizReportData[i].noOfCPasses
        }else if(index == 3){
          tootalSCount = tootalSCount + this.managerQuizReportData[i].noOfSPasses
        }else if(index == 4){
          tootalFCount = tootalFCount + this.managerQuizReportData[i].noOfFPasses
        }
        
      }
    }

    data = [tootalACount,tootalBCount,tootalCCount,tootalSCount,tootalFCount]
    this.passesCount = data;

    dataset = {
      label : 'Standard Deviation',
      data : data,
      fill:false,
      borderColor : ['rgba(75, 192, 192)'],
      tension: 0.5,
      backgroundColor : bgColors
      
    }

    this.classFeeChartData = {
      labels : labels,
      datasets : [dataset]
    }

    this.pieChartData = {

    }

    this.basicOptions = {
      maintainAspectRatio: false,
      aspectRatio: 0.7,
      plugins: {
          legend: {
              labels: {
                  color: 'black',
                  font: {
                    size: 15 
                  }
              }
          }
      },
      datalabels: {
        color: '#ffffff',   // 👈 THIS controls font color
        font: {
          weight: 'bold',
          size: 14
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

    // this.setPieChartData()
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
    let filteredStudentQuizReportData : managerQuizReportVM[]=[]
    this.managerQuizReportDataAll.forEach(element => {
      this.selectedCourses.forEach(ele => {
        if(element.courseCode == ele.code){
          filteredStudentQuizReportData.push(element)
        }
      });
    });
    
    this.managerQuizReportData = filteredStudentQuizReportData;
    this.setPDFData()

  }

  getMarlAsPrecentage(mark : number=0 , noOfQuestions : number=1){
    return (mark/noOfQuestions)*100;
  }

}
