import '../App.css';
import Snake from '../components/Snake';
 import '../snake.css';

export default function About () {
  return (
    <div>
       <h1>How to Play</h1> 

      <div className="separator-line"></div>

<p>xxx</p>
      
      <div className="separator-line"></div>

{/* game component */}

<div className='grid-wrapper'>
<div className='white-box'>
      <Snake />
</div>
</div>
{/* -------------- */}

    </div>
  );
}
