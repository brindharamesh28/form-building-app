import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup,FormControl, Validators } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-root',
  standalone: true,
  imports:[ReactiveFormsModule,CommonModule,DragDropModule,FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent  implements OnInit  {
  title = 'form-builder';
  fieldGroupForm: FormGroup;
  type=''
  fieldGroups = [
    { name: 'AMC Reports',description:'', fields: [] },
    { name: 'HVAC Repair',description:'', fields: [] },
    { name: 'AMC Yearly',description:'', fields: [] },
    { name: 'AMC Installations - Tier 3', description:'' ,fields: [] }
  ];
  inputFields = [{
    inpType: 'Text',
    options:[{
      icon:'fas fa-font',
      label:'Single Line Text',
      subLabel:'Single text area',
      type:'text'
    },{
      icon :'fas fa-align-left',
      label:'Multi Line Text',
      subLabel:'Multi text area',
      type:'textarea'
    },
  {
    icon:'fas fa-list-ol',
    label:'Integer',
    subLabel:'integer type area',
    type:'number'
  },
  ]
  },{
  inpType:'Date',
  options:[{
    icon:'fas fa-calendar',
    label:'Date',
    subLabel:'Select Date from Date Picker',
    type:'date'
  },{
    icon:'fas fa-clock',
    label:'Time',
    subLabel:'Select Time from Time Picker',
    type:'time'
  },{
    icon:'fas fa-calendar',
    label:'Date & Time',
    subLabel:'Select Date and Time from Date and Time Picker',
    type:'datetime-local'
  }]
},
{
  inpType:'Selection',
  options:[{
    icon:'fas fa-dot-circle',
    label:'Single Selection',
    subLabel:'Select one option from the list',
    type:'radio'
  },{
    icon:'fas fa-check-square',
    label:'Multi Selection',
    subLabel:'Select multiple options from the list',
    type:'checkbox'
  },
  {
    icon:'fas fa-check-square',
    label:'DropDown',
    subLabel:'Select multiple options from the list',
    type:'select'
  }
]
},{
  inpType:'Media',
  options:[{
    icon:'fas fa-upload',
    label:'Upload',
    subLabel:'Select media from Gallery',
    type:'file'
  }]
}
]
  selectedGroup!: FormGroup<{ groupName: FormControl<string | null>; description: FormControl<string | null>; fields: FormArray;id: FormControl<number | null>; }>;
  isAddFeildGroupModalOpen: boolean =false;
  isAddFeildInputModalOpen :boolean =false;
  addFieldGroupForm: FormGroup<{ groupName: FormControl<string | null>; description: FormControl<string | null>;fields: FormArray;id: FormControl<number | null>; }>;
  addFieldForm: FormGroup<{ label: FormControl<string | null>; type: FormControl<string | null>;value: FormControl<string | null>;description: FormControl<string | null>; id: FormControl<number | null>; name: FormControl<string | null>; placeholder: FormControl<string | null>; min: FormControl<number | null>; max: FormControl<number | null>; required: FormControl<boolean | null>; }>;
  index: any;

  constructor(private fb: FormBuilder) {
    this.fieldGroupForm = this.fb.group({
      fieldGroups: this.fb.array([]),
    });
    this.addFieldGroupForm = this.fb.group({
      groupName: ['', Validators.required],
      description: [''],
      id: [0],
      fields: this.fb.array([]),
    });
    this.addFieldForm = this.fb.group({
      label: ['', Validators.required],
      name: [''],
      type: [''],
      value: [''],
      description: [''],
      id: [0],
      placeholder: [''],
      min: [0],
      max: [0],
      required: [false]
    });
   
  }
  ngOnInit() {
    // Create a form for each field group
    this.fieldGroups.forEach(group => {
      const groupForm = this.fb.group({
        groupName: [group.name, Validators.required],
        description: [group.description],
        fields: this.fb.array([]),
        id:[ Math.floor(Math.random()* 1000)]

      });
      this.fieldGroupsArray.push(groupForm);
    });

    // Set the first group as the selected group
   
    this.selectedGroup = this.fieldGroupsArray.at(0) as FormGroup;
  }
  get fieldGroupsArray() {
    return (this.fieldGroupForm.get('fieldGroups') as FormArray);
  }
 
  getControl(controlName: string) {
    return this.selectedGroup?.get(controlName) as FormControl
  }

  getFeildsArray(){

    return this.selectedGroup?.get('fields') as FormArray
  }
  validateMinMax(field: any, index: number) {
    const control = this.getFeildsArray().controls[index];
    const min = field.value.min;
    const max = field.value.max;
  
    if (min  && control.value.value.length < min) {
      control.setErrors({ min: true });
    } else if (max  && control.value.value.length > max) {
      control.setErrors({ max: true });
    } else {
      control.setErrors(null);
    }
  }
  selectGroup(group: any) {
    this.selectedGroup = group;
   
  }
getfeildControl(feild:any,controlName:string,i:any){
  
  return feild?.get(controlName) as FormControl

}
  editGroup() {
 
    this.addFieldGroupForm.patchValue(this.selectedGroup.value);
   
    this.type='edit';
    this.isAddFeildGroupModalOpen=true
    // Add your edit logic here
  }
  drop(event: CdkDragDrop<any[]>) {
   
   if (event.previousContainer !== event.container) {
   
    const draggedElement = event.item.data;
    
   

    // Add new control to the selected group's fields array
    this.getFeildsArray().push(
      this.fb.group({
        label: new FormControl('',Validators.required),
        name: new FormControl(draggedElement.label),
        type: new FormControl(draggedElement.type),
        placeholder: new FormControl(draggedElement.placeholder || ''),
        value: new FormControl(''),
        description: new FormControl(''),
        min: new FormControl(''),
        max: new FormControl(''),
        required: new FormControl(false)
      })
    );

  
  }
  else{
    moveItemInArray(this.getFeildsArray().controls, event.previousIndex, event.currentIndex);
  }
  
  
      //  index > -1 ? this.fieldGroupsArray.controls[index]?.fields = newFieldGroup : '';
  }
  copyGroup() {
   
    const copiedGroup = this.fb.group({
      id: [Math.floor(Math.random()* 1000)], // Generate a new random ID
      groupName: [this.selectedGroup?.get('groupName')?.value],
      description: [this.selectedGroup?.get('description')?.value],
      fields: this.selectedGroup?.get('fields')?.value || [],
    });
  
    this.fieldGroupsArray.push(copiedGroup);
    this.selectedGroup = copiedGroup as FormGroup;
  
  }
  
  deleteGroup() {
    const index=this.fieldGroupsArray.controls.indexOf(this.selectedGroup);
    this.fieldGroupsArray.removeAt(index);
    this.selectedGroup = this.fieldGroupsArray.at(0) as FormGroup;
 
  }
  openAddFeildGroup(){
    this.isAddFeildGroupModalOpen=true
  }
  closeAddFeildGroup(){
    this.type=''
    this.isAddFeildGroupModalOpen=false
  }
  addNewFieldGroup() {
 
    if (this.addFieldGroupForm.valid) {
      const newGroupValue = this.addFieldGroupForm.value;

      // Create a new FormGroup for the field group
      const newFieldGroup = this.fb.group({
        groupName: [newGroupValue.groupName ? newGroupValue.groupName : '', Validators.required],
        description: [newGroupValue.description?  newGroupValue.description : ''],
        fields: this.fb.array([]),
        id:[ newGroupValue.id ? newGroupValue.id : Math.floor(Math.random()* 1000)]
      });

      // Add new group to the FormArray
      if(this.type !='edit'){
      this.fieldGroupsArray.push(newFieldGroup);
      }
      else{
        const index=this.fieldGroupsArray.value.findIndex((item:any) => item.id === newFieldGroup.value.id);;
        index > -1 ? this.fieldGroupsArray.controls[index] = newFieldGroup : '';
        this.selectedGroup = newFieldGroup;

      }

      // Reset form after submission
      this.addFieldGroupForm.reset();

      // Close the modal
      this.closeAddFeildGroup();
    }
    else{
      if(!this.addFieldGroupForm.get('groupName')?.value){
        this.addFieldGroupForm.get('groupName')?.setErrors({required:true});
        this.addFieldGroupForm.get('groupName')?.markAsTouched();
      }
    }
    
  }
 


  deleteField(index: number) {
    this.getFeildsArray().removeAt(index);
  }
  exportForm(){
    const formData = this.fieldGroupsArray.value; 
    const blob = new Blob([JSON.stringify(formData, null, 2)], { type: "application/json" });
const url = URL.createObjectURL(blob);
const a = document.createElement("a");
a.href = url;
a.download = "form-data.txt";
document.body.appendChild(a);
a.click();
document.body.removeChild(a);
URL.revokeObjectURL(url);
  }
  copyField(i:any){
    const copiedGroup = this.fb.group({
      label: new FormControl(i.label,Validators.required),
      name: new FormControl(i.name),
      type: new FormControl(i.type),
      placeholder: new FormControl(i.placeholder || ''),
      value: new FormControl(i.value),
      description: new FormControl(i.description),
      min: new FormControl( i.min),
      max: new FormControl( i.max),
      required: new FormControl(i.required)

    });
  
    this.getFeildsArray().push(copiedGroup);
  }
  addNewField(){
    if (this.addFieldForm.valid) {
      const newGroupValue = this.addFieldForm.value;
      this.getFeildsArray().at(this.index).patchValue({
        label: [newGroupValue.label],
        name: newGroupValue.name,
        type: newGroupValue.type,
        placeholder: newGroupValue.placeholder,
        value: newGroupValue.value,
        description: newGroupValue.description,
        min: newGroupValue.min,
        max: newGroupValue.max,
        required: newGroupValue.required
      });
     
    
      this.closeAddFeildInputModal()
      this.addFieldForm.reset();
    }
    else{
      if(!this.addFieldForm.get('label')?.value){
        this.addFieldForm.get('label')?.setErrors({required:true});
        this.addFieldForm.get('label')?.markAsTouched();
      }
    }

  }
  openAddFeildInputModal(i:any){
    this.index=i
  
    this.isAddFeildInputModalOpen=true
    this.addFieldForm.patchValue(this.getFeildsArray().at(this.index).value);
  }
  closeAddFeildInputModal(){
    this.isAddFeildInputModalOpen=false
  
  }
}






