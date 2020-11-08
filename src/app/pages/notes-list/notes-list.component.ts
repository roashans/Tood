import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Note } from './../../shared/note.model';
import { NotesService } from './../../shared/notes.service';
  
@Component({
  selector: 'app-notes-list',
  templateUrl: './notes-list.component.html',
  styleUrls: ['./notes-list.component.css']
})
export class NotesListComponent implements OnInit {

  notes:Note[] = new Array<Note>()
  filteredNotes:Note[] = new Array<Note>();

  @ViewChild('filterInput') filterInputEleRef : ElementRef<HTMLInputElement>;

  constructor(private notesService: NotesService) { }

  ngOnInit(): void {
    this.notes = this.notesService.getAll();
    // this.filteredNotes = this.notes;
    this.filter('');
  }

  deleteNote(note:Note){
    let noteId = this.notesService.getId(note); // get id of note
    this.notesService.delete(noteId);
    this.filter(this.filterInputEleRef.nativeElement.value);
  }

  generateNoteURL(note: Note) {
      let noteId = this.notesService.getId(note);
      return noteId;
  }

  filter(query: string){
    let allResults: Note[] = new Array<Note>(); 

    query = query.toLowerCase().trim();
    let terms:string[] = query.split(' '); // split query by space
    terms = this.removeDuplicates(terms); //remove all query duplicates

    terms.forEach( term=>{
      let results: Note[] = this.relevantNotes(term);
      allResults = [...allResults, ...results] 
    });

    //now duplicate results will be obtained as many query terms filters a same note many times in UI
    let uniqueResults = this.removeDuplicates(allResults); 
    this.filteredNotes = uniqueResults;

    //now sort by relevancy
    this.sortByRelevancy(allResults);
  }

  removeDuplicates(arr: Array<any>): Array<any>{
    let uniqueResults:Set<any> = new Set<any>(); 
    arr.forEach( (valueInArray) => uniqueResults.add(valueInArray) ); 
    return Array.from(uniqueResults);
  } 

  relevantNotes(query: string):Array<Note> {
    query = query.toLowerCase().trim();
    let relevantNotes = this.notes.filter(note => {
      if( (note.body && note.body.includes(query)) || (note.title && note.title.includes(query)) ){
        return true;
      }
      return false;
    })

    return relevantNotes;
  }

  sortByRelevancy(searchReults: Note[]){
    let noteObjCount: Object={};  //key->noteId ;value->times the word occurs

    searchReults.forEach(note => {
      let noteId = this.notesService.getId(note); // get the note id

      if( noteObjCount[noteId] ){
        noteObjCount[noteId]+=1; //increment if note is present in obj already
      }else{
        noteObjCount[noteId]=1; //create if no note is present in Obj
      }

    })

    this.filteredNotes = this.filteredNotes.sort( (a:Note, b:Note) => {
      let aId = this.notesService.getId(a);
      let bId = this.notesService.getId(b); 

      let aCount = noteObjCount[aId];
      let bCount = noteObjCount[bId];

      return bCount- aCount;
    })
  }
}
