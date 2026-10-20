import json
import tempfile
import unittest
import wave
from pathlib import Path
from unittest.mock import patch
from prepare_dataset import prepare
from run_experiment import command

class TrainingToolsTest(unittest.TestCase):
    def test_prepare_excludes_other_speakers_and_incomplete_transcripts(self):
        with tempfile.TemporaryDirectory() as d:
            root = Path(d); audio = root / 'source.mp3'; audio.write_bytes(b'fixture')
            lesson = root / 'lesson.json'
            lesson.write_text(json.dumps({'sentences':[
                {'speaker':'A','text':'Bonjour.','start':0,'end':2},
                {'speaker':'B','text':'Bonsoir.','start':2,'end':4},
                {'speaker':'A','text':'Un [...] exemple.','start':4,'end':6}]}))
            def write_clip(cmd, **kwargs):
                with wave.open(cmd[-1], 'wb') as wav:
                    wav.setnchannels(1); wav.setsampwidth(2); wav.setframerate(22050); wav.writeframes(b'\0\0' * 44100)
            with patch('prepare_dataset.subprocess.run', side_effect=write_clip):
                report = prepare(lesson, audio, root / 'out', 'A')
            self.assertEqual(report['clips'],1)
            self.assertEqual(len(report['excluded']),1)
            self.assertEqual(report['items'][0]['alignment_status'],'automatic_unreviewed')
            self.assertNotIn('Bonsoir',(root/'out/metadata.csv').read_text())

    def test_training_refuses_missing_base_checkpoint(self):
        with tempfile.TemporaryDirectory() as d:
            p=Path(d)
            with self.assertRaisesRegex(ValueError,'No training started'):
                command(p,p/'missing.ckpt',p/'run',20,'cpu')

if __name__=='__main__': unittest.main()
