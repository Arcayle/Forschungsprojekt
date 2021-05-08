let JSON_input = require('D:/google drive/10. Semester SS21/Projekt-INF/Piano/Code/Invention_4_by_J_S_Bach_BWV_775_for_Piano_with_fingering.mid.json');
let vn_ar = [];
let notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
let octave = ['0', '1', '2', '3', '4', '5', '6', '7'];

// Max range = 1 Oktave (8)
let Handrange_custom_range = 5;
let Handrange_custom_mode = true;
// für die nächsten n Noten werden optimales Fingering bestimmt
let n = 5;
let l = 0;
let stop = (l + n);
let scoring = [];
let scoring_notes = [];
let scoring_sequence = [];
let scoring_notes_sequence = [];

let Handposition = [
    ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G'],
    ['D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A'],
    ['E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'],
    ['F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C'],
    ['G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D'],
    ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E'],
    ['B', 'C', 'C#', 'D', 'D#', 'E', 'F']
];


//zu jeder note wird die entsprechende Handposition/fingerposition in handposition_sequence gespeichert
let handposition_sequence = [];
let temp_scoring = [];
let index_scoring_desc = [];


let fingerposition = [];
let fingerposition_counter = 0;
let fingerposition_sequence = [];
let fingerposition_distance = [];


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
for (let i = 0; i < 9; i++) {
    notes_octaves.shift();
}
notes_octaves.push('C8')



//JSON_input.tracks[0] == Violion Noten
//JSON_input.tracks[1] == Bass Noten
//holt aus der JSON Datei die Noten in vn_ar
for (let i = 0; i < JSON_input.tracks[0].notes.length; i++) {
    vn_ar.push(JSON_input.tracks[0].notes[i].name);

}



/*
Erste Handposition wird von der ersten Note bis Handpositions + 0 + Handrange bestimmt, 
die nächsten n Handpositionen mit n-ten Note bis Handposition + n-1 + Handrange bestimmt bis
die letzte note von einer Handposition gespielt werden kann
*/
Handposition = [[]];
let j = 0;
let m = 0;
let p = 0;
let i = 0;
let Handposition_flag = true;
let Handposition_counter = 0;
scoring_notes.push(new Array());
scoring.push(0);

if (Handrange_custom_mode) {


    while (Handposition_flag) {


        while (m != Handrange_custom_range) {

            Handposition[i].push(notes_octaves[j % (notes_octaves.length)]);

            if (notes_octaves[j % (notes_octaves.length)] == 'C8') {
                Handposition_flag = false
            }

            if (!notes_octaves[j % (notes_octaves.length)].includes('#')) {
                m++;
            }

            j++;


        }


        if (Handposition[i][0].includes('E') || Handposition[i][0].includes('B')) {

            p++;

        } else {

            p = p + 2;
        }

        m = 0;
        j = p;
        i++;

        // für jede neu berechnete Handposition ein Array / Platz für Arrays machen um methode push ausführen zu können
        if (Handposition_flag) {
            Handposition.push(new Array());
            scoring_notes.push(new Array());
            scoring.push(0);
            Handposition_counter++;
        }

    }
}




// Akkorde? 
//Es wird angenommen die nächste Note wird nicht mit dem letzten Finger gespielt
//Falls in Reichweite Hand position nicht weschseln
//Falls nicht mehr in Reichweite eine Bestimmte Handposition annehmen
while (vn_ar.length - l > 0) {

    //------Handposition alg.

    // verteilt ein Scoring basierend auf gleichheit der Handpositionen und den nächsten n-noten
    for (i = 0; i < Handposition.length; i++) {

        for (let j = l; j < stop; j++) {

            // für die letzten noten (restlichen noten die weniger als n sind)  
            if ((l + n) - 1 > vn_ar.length) {
                stop = vn_ar.length;
            }

            if (Handposition[i].includes(vn_ar[j])) {

                scoring[i]++;
                scoring_notes[i].push(vn_ar[j]);

            }

        }

    }

    //sequence speichert Scoring und der gespielten n Noten 
    scoring_sequence.push(scoring);
    scoring_notes_sequence.push(scoring_notes);
    // temp_scoring ist eine Kopie von scoring 
    temp_scoring = scoring.slice();
    // push indexe mit dem Höchstem Scoring in temp_scoring Array
    // um darunterliegende Funktion realisieren zu können
    for (let i = 0; i < temp_scoring.length; i++) {

        index_scoring_desc[i] = temp_scoring.indexOf(Math.max.apply(Math, temp_scoring));
        temp_scoring[temp_scoring.indexOf(Math.max.apply(Math, temp_scoring))] = 0;

    }
    // Bestimmt optimale Handposition für die nächsten n Noten mit einer priorty.
    // Handposition mit dem höchstem Scoring hat die höchste priorität und wird demnach immer zuerst mit der nächsten note verglichen
    // falls nicht spielbar dann wechsel zur nächsten Handposition priorität / 2. größtem scoring
    // je mehr Noten eine Handposition spielen kann desto höher ist die wsk. das eine Note aus den nächsten n noten mit dieser Handposition gespielt werden kann

    let index_scoring_desc_i = 0
    for (let k = l; k < stop; k++) {

        if (scoring_notes[index_scoring_desc[index_scoring_desc_i]].includes(vn_ar[k])) {

            handposition_sequence.push(new Array(index_scoring_desc[index_scoring_desc_i], vn_ar[k]));
            index_scoring_desc_i = 0;

        } else {

            index_scoring_desc_i++;
            k--;

        }

    }
    index_scoring_desc = [];


    //----------Fingerposition
    //Fingerposition tracking mit Handposition und Oktave
    //fingerposition = [Daumen, Zeigefinger, Mittelfinger, Ringfinger, Kleinerfinger] 
    for (let k = l; k < stop; k++) {

        // fingerposition ist am Anfang auf (allen) weißen Tasten 
        // Beginnend mit dem Daumen auf der ersten Note
        // Range muss mind 5 sein
        // garantiert das finger in Range zu den nächsten n noten sind     
        for (let j = 0; j < 5; j++) {

            if (!Handposition[handposition_sequence[k][0]][fingerposition_counter].includes('#')) {
                fingerposition[j] = Handposition[handposition_sequence[k][0]][fingerposition_counter];
            } else {
                j--;
            }
            fingerposition_counter++;

        }
        fingerposition_counter = 0;

        // Note ist mit der Akutellen Fingerposition spielbar
        if (fingerposition.includes(vn_ar[k])) {
            handposition_sequence[k].push(fingerposition.indexOf(vn_ar[k])+1);
            fingerposition_sequence.push(handposition_sequence[k]);
            
        // Falls nicht herausfinden welcher Finger die kürzeste Distanz zur nächsten Note hat
        // Hand ist bereits in Range um Note zu spielen, nur noch Finger richtig wechseln 
        } else {
                
            //Distance Algorithmus
            for (let u = 0; u < Handposition[handposition_sequence[k][0]].length; u++) {

                // fingerposition_distance = [note, distanz zur nächst gespielten note]
                // fingerposition_distance.push(Handposition note, note Index - nächste gespielte Note Index )
                // Beispiel : Distanz von E4 und A#4 ist 6 => fingerposition_distance[i] = [ "E4", 6,]
                fingerposition_distance.push(new Array(Handposition[handposition_sequence[k][0]][u],
                    Math.abs(Handposition[handposition_sequence[k][0]].indexOf(Handposition[handposition_sequence[k][0]][u]) -
                        Handposition[handposition_sequence[k][0]].indexOf(vn_ar[k])
                    ),
                    vn_ar[k]
                )
                );


            }
            
            // note k ist eine schwarze Taste
            //letzte Note mit Finger LN? => spiele note k mit RN
            //letzte Note mit Finger RN? => spiele note k mit LN
            //   weder noch => note k+1 näher an RN als LN? spiele note k mit LN
            //              => note k+1 näher an LN als RN? spiele note k mit RN
            
            let nachbarn = [];
            for (let i = 0; i < fingerposition_distance.length; i++) {

                if (fingerposition_distance[i][1] == 1) {
                    nachbarn.push(fingerposition_distance[i][0]);
                }

            }

             //note k+1 distanz zu RN kleiner als LN? spiele note k mit LN
            if( Math.abs(notes_octaves.indexOf(vn_ar[k+1]) - notes_octaves.indexOf(nachbarn[1])) <
             Math.abs(notes_octaves.indexOf(vn_ar[k+1]) - notes_octaves.indexOf(nachbarn[0])) ){
                 
                handposition_sequence[k].push(fingerposition.indexOf(nachbarn[0])+1);
                fingerposition_sequence.push(handposition_sequence[k]);    
         
             // note k+1 distanz zu LN kleiner als RN? spiele note k mit RN
            } else {
             
                handposition_sequence[k].push(fingerposition.indexOf(nachbarn[1])+1);
                fingerposition_sequence.push(handposition_sequence[k]);

            }

 


            /*
            let Handposition_in_use = Handposition[handposition_sequence[k][0]];
            let notenposition_in_positions = 0;
            let mögliche_nachbar_noten_links = '';
            let mögliche_nachbar_noten_links_schwach = '';
            let mögliche_nachbar_noten_rechts = '';
            let mögliche_nachbar_noten_rechts_schwach = '';

            for (let i = 0; i < Handposition_in_use.length; i++) {
                if (Handposition_in_use[i] == vn_ar[k]) {
                    notenposition_in_positions = i;
                }
            }


            if (notenposition_in_positions - 1 < 0) {
                notenposition_in_positions += 7;
                mögliche_nachbar_noten_links = Handposition_in_use[notenposition_in_positions - 1];
            }
            else {
                mögliche_nachbar_noten_links = Handposition_in_use[notenposition_in_positions - 1];
            }

            if (notenposition_in_positions - 2 < 0) {
                notenposition_in_positions += 7;
                mögliche_nachbar_noten_links_schwach = Handposition_in_use[notenposition_in_positions - 2];
            }
            else {
                mögliche_nachbar_noten_links_schwach = Handposition_in_use[notenposition_in_positions - 2];
            }

            if (notenposition_in_positions + 1 > 6) {
                notenposition_in_positions -= 7;
                mögliche_nachbar_noten_rechts = Handposition_in_use[notenposition_in_positions + 1];
            }
            else {
                mögliche_nachbar_noten_rechts = Handposition_in_use[notenposition_in_positions + 1];
            }

            if (notenposition_in_positions + 2 > 6) {
                notenposition_in_positions += 7;
                mögliche_nachbar_noten_rechts_schwach = Handposition_in_use[notenposition_in_positions + 2];
            }
            else {
                mögliche_nachbar_noten_rechts_schwach = Handposition_in_use[notenposition_in_positions + 2];
            }

            let richtiger_finger = false;//(boolean variable, links = false)
            let richtiger_finger_wurde_gesetzt;//boolean)
            let schwacher_finger_falls_kein_starker_gefunden = false;//(boolean variable, links = false)



            //läuft rückwärts da nächste note am wichtigsten, man überschreibt immer falls wichtigere position.

            if (vn_ar[k + 1] == mögliche_nachbar_noten_links) {
                //richtiger finger ist der rechtere
                // von oben nach unten ( von links nach rechts)
                let nachbarn = [];
                for (let i = 0; i < fingerposition_distance.length; i++) {

                    fingerposition_distance[i][1]
                    if (fingerposition_distance[i][1] == 1) {
                        nachbarn.push(fingerposition_distance[i][1]);
                    }

                }
                // der rechte Nachbar
                fingerposition[fingerposition.indexOf(nachbarn[1])] = vn_ar[k];
                fingerposition_sequence.push(handposition_sequence[k].push(fingerposition.indexOf(vn_ar[k])));


                richtiger_finger = true;
                richtiger_finger_wurde_gesetzt = true;

            }

            if (vn_ar[k + 1] == mögliche_nachbar_noten_rechts) {
                //richtiger finger ist der linkere
                // von oben nach unten ( von links nach rechts)
                let nachbarn = [];
                for (let i = 0; i < fingerposition_distance.length; i++) {

                    fingerposition_distance[i][1]
                    if (fingerposition_distance[i][1] == 1) {
                        nachbarn.push(fingerposition_distance[i][1]);
                    }

                }
                // der rechte Nachbar
                fingerposition[fingerposition.indexOf(nachbarn[0])] = vn_ar[k];
                fingerposition_sequence.push(handposition_sequence[k].push(fingerposition.indexOf(vn_ar[k])));




                richtiger_finger = false;
                richtiger_finger_wurde_gesetzt = true;
            }

            if (vn_ar[k + 1] == mögliche_nachbar_noten_links_schwach) {
                schwacher_finger_falls_kein_starker_gefunden = true;
            }

            if (vn_ar[k + 1] == mögliche_nachbar_noten_rechts_schwach) {
                schwacher_finger_falls_kein_starker_gefunden = false;
            }


            if (richtiger_finger_wurde_gesetzt == false) {
                if (schwacher_finger_falls_kein_starker_gefunden == false) {
                    //richtiger finger ist der linke
                    // von oben nach unten ( von links nach rechts)
                    let nachbarn = [];
                    for (let i = 0; i < fingerposition_distance.length; i++) {

                        fingerposition_distance[i][1]
                        if (fingerposition_distance[i][1] == 1) {
                            nachbarn.push(fingerposition_distance[i][1]);
                        }

                    }
                    // der rechte Nachbar
                    fingerposition[fingerposition.indexOf(nachbarn[0])] = vn_ar[k];
                    fingerposition_sequence.push(handposition_sequence[k].push(fingerposition.indexOf(vn_ar[k])));

                } else {
                    //der rechte Nachbar
                    // von oben nach unten ( von links nach rechts)
                    let nachbarn = [];
                    for (let i = 0; i < fingerposition_distance.length; i++) {

                        fingerposition_distance[i][1]
                        if (fingerposition_distance[i][1] == 1) {
                            nachbarn.push(fingerposition_distance[i][1]);
                        }

                    }
                    // der rechte Nachbar
                    fingerposition[fingerposition.indexOf(nachbarn[1])] = vn_ar[k];
                    fingerposition_sequence.push(handposition_sequence[k].push(fingerposition.indexOf(vn_ar[k])));
                }
            }
            */


            fingerposition_distance = [];

        }

    }



    l = l + n;
    stop = (l + n);
    scoring = [];
    scoring_notes = [];
    for (let i = 0; i < Handposition_counter + 1; i++) {
        scoring.push(0);
        scoring_notes.push(new Array());

    }



}


const fs = require('fs');
const jsonContent = JSON.stringify(fingerposition_sequence);

fs.writeFile("./fingerposition_sequence.json", jsonContent, 'utf8', function (err) {
    if (err) {
        return console.log(err);
    }

    console.log("The file was saved!");
}); 