let JSON_input = require('D:/google drive/10. Semester SS21/Projekt-INF/Piano/Code/Invention_4_by_J_S_Bach_BWV_775_for_Piano_with_fingering.mid.json');
let vn_ar = [];
let notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
let octave = ['0', '1', '2', '3', '4', '5', '6', '7'];

let counter = 0;
let length = 0;

let Handrange_custom_range = 5;
let Handrange_custom_mode = true;

let n = 6;
let l = 0;
let stop = (l + n);
let scoring = [0, 0, 0, 0, 0, 0, 0];
let scoring_notes = [[], [], [], [], [], [], []];
let scoring_sequence = [];
let scoring_notes_sequence = [];
let fingerposition_0 = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G'];
let fingerposition_1 = ['D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A'];
let fingerposition_2 = ['E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
let fingerposition_3 = ['F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C'];
let fingerposition_4 = ['G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D'];
let fingerposition_5 = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E'];
let fingerposition_6 = ['B', 'C', 'C#', 'D', 'D#', 'E', 'F'];

let fingerpositions = [
    ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G'],
    ['D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A'],
    ['E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'],
    ['F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C'],
    ['G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D'],
    ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E'],
    ['B', 'C', 'C#', 'D', 'D#', 'E', 'F']
];


/* 
//füllt notes_octaves mit allen Noten
let notes_octaves = [];
let k = 0;
for (let i = 0; i < octave.length; i++) {
    
    for (let j = 0; j < notes.length; j++) {
        
        //console.log(j);
        notes_octaves[k] = notes[j].concat(octave[i]); 
        k++;

    }
    
} 
*/



//JSON_input.tracks[0] == Violion Noten
//JSON_input.tracks[1] == Bass Noten
//holt aus der JSON Datei die Noten in vn_ar
for (let i = 0; i < JSON_input.tracks[0].notes.length; i++) {
    vn_ar.push(JSON_input.tracks[0].notes[i].name);

}



/* 
dynmaische Fingerpositions Bestimmung abhängig von gewählten Handbreite:

Es wird angenommen, dass die Maximale Range genau einer Oktave + 1 entspricht (also bspw: C1 bis B1 + C2).
Die optimale Anzahl der Handpositionen entspricht genau 7 unabhängig von der Handrange.
Dadurch wird die anzahl der Handpositionswechsel minimiert.

Beispiel: 
1) Handpositionen mit weniger als 7
let fingerposition_0 = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G'];
let fingerposition_1 = ['D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A'];
let fingerposition_2 = ['E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
let fingerposition_3 = ['F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C'];
Noten zu spielen: A,B,C,D
Handpositionswechsel : 4

=> bei 7 Handpositionen gäbe es keinen Handpositionswechsel zu den Noten 
=> je Mehr Handpositionen, desto geringer die wsk. Handpositionen zu wechseln
=> Bei mehr als 7 Handpositionen werden Handpositionen doppelt belegt, also gibt es max 7 Handpositionen

*/
if (Handrange_custom_mode) {

    let j = 0;
    let m = 0;
    let p = 0;
    let h = 0;
    fingerpositions = [[], [], [], [], [], [], []];

    for (let i = 0; i < fingerpositions.length; i++) {

        while(m != Handrange_custom_range) {
            
            fingerpositions[i][h] = notes[j % (notes.length)];
            
            if(notes[j % (notes.length)].substr(1) != '#'){
                m++;                
            }
            
            j++;
            h++;
        }
        
        if(fingerpositions[i][0] == 'E' || fingerpositions[i][0] == 'B'){
            
            p++;
            
        } else {

            p = p + 2;
        }
        
        h = 0;
        m = 0;
        j = p;
    }

}






//fügt zu den Noten der fingerpositions noch (alle) Oktaven hinzu 
while (counter <= fingerpositions.length) {

    length = fingerpositions[counter].length;

    for (let i = 0; i < octave.length; i++) {

        for (let j = 0; j < length; j++) {

            fingerpositions[counter].push(fingerpositions[counter][j].concat(octave[i]));

        }


    }
    counter++;

}




//Es wird angenommen die nächste Note wird nicht mit dem letzten Finger gespielt
//Falls in Reichweite Hand position nicht weschseln
//Falls nicht mehr in Reichweite eine Bestimmte Handposition annehmen
while (vn_ar.length - l > 0) {

    //Handposition alg.

    // verteilt ein Scoring basierend auf gleichheit der Handpositionen und den nächsten n-noten
    for (i = 0; i < fingerpositions.length; i++) {

        for (let j = l; j < stop; j++) {

            // für die letzten noten (restlichen noten die weniger als n sind)  
            if ((l + n) - 1 > vn_ar.length) {
                stop = vn_ar.length;
            }

            if (fingerpositions[i].includes(vn_ar[j])) {

                scoring[i]++;
                scoring_notes[i].push(vn_ar[j]);

            }

        }

    }

    //sequence speichert Scoring und der gespielten n Noten 
    scoring_sequence.push(scoring);
    scoring_notes_sequence.push(scoring_notes);

    let Handposition_max_score = 0;
    let Handposition_max = [];

    //Bestimmt optimale Handposition für die nächsten n Noten 
    // In bearbeitung
    for (let k = l; k < stop; k++) {

        // Nehme Handposition mit höchstem Scoring 
        for (let v = 0; v < scoring_notes_sequence.length; v++) {

            if (scoring_notes_sequence[v].includes(vn_ar[l]) && scoring_notes_sequence[v].length > Handposition_max_score) {

                Handposition_max_score = scoring_notes_sequence[v].length;
                Handposition_max = scoring_notes_sequence[v];

            }
        }

        /*
        Falls nächste Note nicht mehr mit der Akutellen Handposition spielbar ist und 
        mehrere Handpositionen gleichen Score haben, wechsel zur Handposition mit der 
        kleinsten Distanz zur letzten Handposition
        */
        /*      
        for (let p = k; p < stop; p++) {
            
            if(!Handposition_max.includes(vn_ar[p])){
            
            }
            
        } */


    }


    //fingerpositions alg.
    /*
    Todo: 
        Problem : nächster Finger wird mit kleinster Fingerdistanz zur Note gewählt, aber
                  welcher wird gewählt bei gleicher distanz?  
        Lösung: Man betrachtet die nächsten x (hier 5) noten und ob und welcher finger als nächstes nochmal benötigt wird.
                Dann verwendet man zum spielen dieser note den anderen.
        let notenposition_in_positions=0;
        let zu_überprüfende_note= scoring_notes_sequence[(position der zu überprüfenden note)];
            //man muss benachbarte noten in fingerpositions finden.
            for (let i = 0; i < 6; i++) {
                if((verwendete fingerpositions)[i]==zu_überprüfende_note){
                    notenposition_in_positions=i;
                }
            }
            let mögliche_nachbar_noten_links= (verwendete fingerpositions)[i-1];
            let mögliche_nachbar_noten_rechts= (verwendete fingerpositions)[i+1];
            //Da es auch sein kann, dass man den anderen finger zum spielen einer #note braucht wird es als schwaches nachbar scoring verwendet falls in mögliche_nachbar_noten_links und mögliche_nachbar_noten_rechts
           // nichts vorkommt.
            let mögliche_nachbar_noten_links_schwach= (verwendete fingerpositions)[i-2];
            let mögliche_nachbar_noten_rechts_schwach= (verwendete fingerpositions)[i+2];
            //überprüfen ob in den nächsten noten eine der nachbar möglichkeiten vorkommt.
            let richtiger_finger=false;//(boolean variable, links = false)
            let richtiger_finger_wurde_gesetzt;(//boolean)
            let schwacher_finger_falls_kein_starker_gefunden=false;//(boolean variable, links = false)
        for (let v = 5; v >= 1; v--) //läuft rückwärts da nächste note am wichtigsten, man überschreibt immer falls wichtigere position.
        {
            
            if(scoring_notes_sequence[(position der zu überprüfenden note) + v]==mögliche_nachbar_noten_links){
                //richtiger finger ist der rechtere
               richtiger_finger=true;
               richtiger_finger_wurde_gesetzt=true;
            }
            if(scoring_notes_sequence[(position der zu überprüfenden note) + v]==mögliche_nachbar_noten_rechts){
                //richtiger finger ist der linkere
                richtiger_finger=false;
                richtiger_finger_wurde_gesetzt=true;
            }
            if(scoring_notes_sequence[(position der zu überprüfenden note) + v]==mögliche_nachbar_noten_links_schwach){
                schwacher_finger_falls_kein_starker_gefunden=true;
            }
            if(scoring_notes_sequence[(position der zu überprüfenden note) + v]==mögliche_nachbar_noten_rechts_schwach){
                schwacher_finger_falls_kein_starker_gefunden=false;
            }

        }
        if(richtiger_finger_wurde_gesetzt==false){
            if(schwacher_finger_falls_kein_starker_gefunden==false){
                //richtiger finger ist der linke
            }
            else{
                //der rechte finger
            }
        }
    */


    l = l + n + 1;
    stop = (l + n);
    scoring = [0, 0, 0, 0, 0, 0, 0];
    scoring_notes = [[], [], [], [], [], [], []];

}






