import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms'; 
import { Note } from './../../shared/note.model';
import { NotesService } from './../../shared/notes.service';
import { ActivatedRoute, Router, Params } from '@angular/router';

@Component({
  selector: 'app-note-details',
  templateUrl: './note-details.component.html',
  styleUrls: ['./note-details.component.css']
})
export class NoteDetailsComponent implements OnInit {

  note: Note;
  noteIdcurr: number;
  new: boolean;

  constructor(private notesService:NotesService, private router:Router, private route: ActivatedRoute) { }

  ngOnInit(): void {

    this.note = new Note();

    //find if we are to create a new note OR edit a existing note(from url if id is present, then its existing)
    this.route.params.subscribe((params: Params) => {
      if (params.id){
        this.note = this.notesService.get(params.id);
        this.noteIdcurr = params.id;
        this.new = false; 
      } else{
        this.new = true; 
      }

    });
  }

  onSubmit(form: NgForm){
    if(this.new){
      //save the newly created note
      this.notesService.add(form.value);
    } else {
      //update the existing note 
      this.notesService.update(this.noteIdcurr, form.value.title, form.value.body);
    }

    this.router.navigateByUrl('/'); 
  }

  cancel(){
    //back button in note-details
    this.router.navigateByUrl('/');
  }
}
