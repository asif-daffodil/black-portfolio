import { profileData } from '@/data/profile';

export default function Footer() {
  return (
    <footer className="sr-only" aria-label="Site Footer and Copyright">
      <div>
        <p>
          &copy; {new Date().getFullYear()} {profileData.name}. All rights reserved.
        </p>
        <p>
          {profileData.title} — {profileData.tagline}
        </p>
        <nav aria-label="Footer Quick Links">
          <a href="#bridge">Home</a>
          <a href="#about">About</a>
          <a href="#skills">Skills</a>
          <a href="#experience">Experience</a>
          <a href="#education">Education</a>
          <a href="#ai">AI Engineering</a>
          <a href="#portfolio">Portfolio</a>
          <a href="#contact">Contact</a>
        </nav>
      </div>
    </footer>
  );
}
