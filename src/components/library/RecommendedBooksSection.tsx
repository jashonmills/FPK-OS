
import React from 'react';
import { useAccessibility } from '@/hooks/useAccessibility';
import { ScrollArea } from '@/components/ui/scroll-area';
import RecommendedBookListItem from './RecommendedBookListItem';
import { Book, CuratedBook } from '@/types/library';

interface RecommendedBooksSectionProps {
  onBookSelect: (book: Book) => void;
}

const recommendedBooks: CuratedBook[] = [
  // Original 6 books
  {
    title: "Thinking in Pictures",
    author: "Temple Grandin",
    workKey: "/works/OL45883W",
    description: "A groundbreaking work that offers insights into autism and visual thinking",
    coverId: 240726
  },
  {
    title: "The Reason I Jump",
    author: "Naoki Higashida",
    workKey: "/works/OL16814394W",
    description: "A thirteen-year-old boy with autism answers questions about his condition",
    coverId: 7917284
  },
  {
    title: "All Cats Have Asperger Syndrome",
    author: "Kathy Hoopmann",
    workKey: "/works/OL338170W",
    description: "A delightful book that uses cat behavior to explain Asperger Syndrome",
    coverId: 6640026
  },
  {
    title: "Different Like Me",
    author: "Jennifer Elder",
    workKey: "/works/OL7846811W",
    description: "Stories of famous people who were different and how they succeeded",
    coverId: 6640027
  },
  {
    title: "Freaks, Geeks, and Asperger Syndrome",
    author: "Luke Jackson",
    workKey: "/works/OL5602916W",
    description: "A teenager's guide to life with Asperger Syndrome",
    coverId: 437858
  },
  {
    title: "The Survival Guide for Kids with Autism Spectrum Disorder",
    author: "Elizabeth Verdick",
    workKey: "/works/OL23031103W",
    description: "A practical guide to help kids understand and thrive with autism",
    coverId: 6917463
  },
  // Additional 44 books
  {
    title: "El Deafo",
    author: "Cece Bell",
    workKey: "/works/OL17063486W",
    description: "A graphic memoir about growing up with hearing loss",
    coverId: 8682150
  },
  {
    title: "The Curious Incident of the Dog in the Night-Time",
    author: "Mark Haddon",
    workKey: "/works/OL8193405W",
    description: "A mystery novel narrated by a teenager with autism",
    coverId: 328467
  },
  {
    title: "Out of My Mind",
    author: "Sharon M. Draper",
    workKey: "/works/OL5735542W",
    description: "A girl with cerebral palsy discovers her voice",
    coverId: 6232538
  },
  {
    title: "Fish in a Tree",
    author: "Lynda Mullaly Hunt",
    workKey: "/works/OL17306981W",
    description: "A girl with dyslexia discovers her strengths",
    coverId: 8682151
  },
  {
    title: "The Misfits",
    author: "James Howe",
    workKey: "/works/OL59825W",
    description: "Four friends who don't fit in start their own political party",
    coverId: 6640028
  },
  {
    title: "Wonder",
    author: "R.J. Palacio",
    workKey: "/works/OL16291840W",
    description: "A boy with facial differences starts mainstream school",
    coverId: 7917285
  },
  {
    title: "The London Eye Mystery",
    author: "Siobhan Dowd",
    workKey: "/works/OL5735543W",
    description: "A boy with Asperger's solves a mystery",
    coverId: 6232539
  },
  {
    title: "Rain Reign",
    author: "Ann M. Martin",
    workKey: "/works/OL17306982W",
    description: "A girl with autism and her love for her dog",
    coverId: 8682152
  },
  {
    title: "The Running Dream",
    author: "Wendelin Van Draanen",
    workKey: "/works/OL15895134W",
    description: "A runner adapts after losing her leg",
    coverId: 7234567
  },
  {
    title: "Mockingbird",
    author: "Kathryn Erskine",
    workKey: "/works/OL15419264W",
    description: "A girl with Asperger's deals with her brother's death",
    coverId: 6635701
  },
  {
    title: "The First Rule of Punk",
    author: "Celia C. Pérez",
    workKey: "/works/OL19663451W",
    description: "A Mexican-American girl finds her voice through punk rock",
    coverId: 8856789
  },
  {
    title: "The War That Saved My Life",
    author: "Kimberly Brubaker Bradley",
    workKey: "/works/OL17511617W",
    description: "A girl with a club foot finds freedom during WWII",
    coverId: 8345231
  },
  {
    title: "Restart",
    author: "Gordon Korman",
    workKey: "/works/OL19915674W",
    description: "A boy with amnesia gets a chance to start over",
    coverId: 8945612
  },
  {
    title: "Ghost",
    author: "Jason Reynolds",
    workKey: "/works/OL17912345W",
    description: "A boy with ADHD finds his place on the track team",
    coverId: 8745123
  },
  {
    title: "The Thing About Jellyfish",
    author: "Ali Benjamin",
    workKey: "/works/OL17612890W",
    description: "A girl processes grief through science",
    coverId: 8534567
  },
  {
    title: "Blubber",
    author: "Judy Blume",
    workKey: "/works/OL59826W",
    description: "A classic tale about bullying and standing up",
    coverId: 437859
  },
  {
    title: "The Crossover",
    author: "Kwame Alexander",
    workKey: "/works/OL17323456W",
    description: "Twin brothers navigate basketball and family",
    coverId: 8412789
  },
  {
    title: "Front Desk",
    author: "Kelly Yang",
    workKey: "/works/OL19445623W",
    description: "A Chinese-American girl helps run a motel",
    coverId: 8756234
  },
  {
    title: "New Kid",
    author: "Jerry Craft",
    workKey: "/works/OL20123457W",
    description: "A graphic novel about fitting in at a new school",
    coverId: 9234567
  },
  {
    title: "The Parker Inheritance",
    author: "Varian Johnson",
    workKey: "/works/OL19665432W",
    description: "A mystery that spans generations",
    coverId: 8867543
  },
  {
    title: "Because of Winn-Dixie",
    author: "Kate DiCamillo",
    workKey: "/works/OL59827W",
    description: "A girl and her dog bring a community together",
    coverId: 437860
  },
  {
    title: "Freak the Mighty",
    author: "Rodman Philbrick",
    workKey: "/works/OL59828W",
    description: "An unlikely friendship between two different boys",
    coverId: 437861
  },
  {
    title: "The Wild Robot",
    author: "Peter Brown",
    workKey: "/works/OL17789123W",
    description: "A robot learns to survive in the wilderness",
    coverId: 8634521
  },
  {
    title: "Hatchet",
    author: "Gary Paulsen",
    workKey: "/works/OL59829W",
    description: "A boy survives alone in the Canadian wilderness",
    coverId: 437862
  },
  {
    title: "Bridge to Terabithia",
    author: "Katherine Paterson",
    workKey: "/works/OL59830W",
    description: "A friendship that creates an imaginary kingdom",
    coverId: 437863
  },
  {
    title: "The Giver",
    author: "Lois Lowry",
    workKey: "/works/OL59831W",
    description: "A dystopian novel about conformity and individuality",
    coverId: 437864
  },
  {
    title: "Holes",
    author: "Louis Sachar",
    workKey: "/works/OL59832W",
    description: "A boy at a juvenile detention camp uncovers mysteries",
    coverId: 437865
  },
  {
    title: "The Outsiders",
    author: "S.E. Hinton",
    workKey: "/works/OL59833W",
    description: "A classic about social class and belonging",
    coverId: 437866
  },
  {
    title: "Esperanza Rising",
    author: "Pam Muñoz Ryan",
    workKey: "/works/OL59834W",
    description: "A Mexican girl's journey during the Great Depression",
    coverId: 437867
  },
  {
    title: "Maniac Magee",
    author: "Jerry Spinelli",
    workKey: "/works/OL59835W",
    description: "A boy who runs between two worlds",
    coverId: 437868
  },
  {
    title: "Walk Two Moons",
    author: "Sharon Creech",
    workKey: "/works/OL59836W",
    description: "A girl's journey to find her missing mother",
    coverId: 437869
  },
  {
    title: "Number the Stars",
    author: "Lois Lowry",
    workKey: "/works/OL59837W",
    description: "A girl helps Jewish friends during WWII",
    coverId: 437870
  },
  {
    title: "Island of the Blue Dolphins",
    author: "Scott O'Dell",
    workKey: "/works/OL59838W",
    description: "A girl survives alone on an island",
    coverId: 437871
  },
  {
    title: "The Girl Who Drank the Moon",
    author: "Kelly Barnhill",
    workKey: "/works/OL18234567W",
    description: "A magical tale about a girl raised by a witch",
    coverId: 8756789
  },
  {
    title: "The One and Only Ivan",
    author: "Katherine Applegate",
    workKey: "/works/OL16567890W",
    description: "A gorilla's story of captivity and freedom",
    coverId: 7845623
  },
  {
    title: "Where the Red Fern Grows",
    author: "Wilson Rawls",
    workKey: "/works/OL59839W",
    description: "A boy and his hunting dogs in the Ozarks",
    coverId: 437872
  },
  {
    title: "The Secret Garden",
    author: "Frances Hodgson Burnett",
    workKey: "/works/OL59840W",
    description: "A girl discovers a hidden garden and friendship",
    coverId: 437873
  },
  {
    title: "A Wrinkle in Time",
    author: "Madeleine L'Engle",
    workKey: "/works/OL59841W",
    description: "A girl travels through time and space",
    coverId: 437874
  },
  {
    title: "The Chronicles of Narnia: The Lion, the Witch and the Wardrobe",
    author: "C.S. Lewis",
    workKey: "/works/OL59842W",
    description: "Children discover a magical world",
    coverId: 437875
  },
  {
    title: "Harry Potter and the Philosopher's Stone",
    author: "J.K. Rowling",
    workKey: "/works/OL82563W",
    description: "A boy wizard begins his magical education",
    coverId: 10521270
  },
  {
    title: "The Lightning Thief",
    author: "Rick Riordan",
    workKey: "/works/OL5735544W",
    description: "A boy discovers he's the son of a Greek god",
    coverId: 6232540
  },
  {
    title: "The Phantom Tollbooth",
    author: "Norton Juster",
    workKey: "/works/OL59843W",
    description: "A boy's journey through the Lands Beyond",
    coverId: 437876
  },
  {
    title: "From the Mixed-Up Files of Mrs. Basil E. Frankweiler",
    author: "E.L. Konigsburg",
    workKey: "/works/OL59844W",
    description: "Children hide in the Metropolitan Museum",
    coverId: 437877
  },
  {
    title: "The Watsons Go to Birmingham - 1963",
    author: "Christopher Paul Curtis",
    workKey: "/works/OL59845W",
    description: "A family's journey during the Civil Rights era",
    coverId: 437878
  },
  {
    title: "Roll of Thunder, Hear My Cry",
    author: "Mildred D. Taylor",
    workKey: "/works/OL59846W",
    description: "An African American family in Depression-era Mississippi",
    coverId: 437879
  }
];

const RecommendedBooksSection: React.FC<RecommendedBooksSectionProps> = ({ onBookSelect }) => {
  const { getAccessibilityClasses } = useAccessibility();

  return (
    <section className="space-y-4">
      <div>
        <h3 className={`text-xl font-semibold mb-2 ${getAccessibilityClasses('text')}`}>
          Recommended for Neurodiverse Learners
        </h3>
        <p className={`text-sm text-muted-foreground ${getAccessibilityClasses('text')}`}>
          50 hand-picked titles that celebrate differences and support understanding
        </p>
      </div>
      
      <ScrollArea className="h-96 w-full border rounded-lg p-2">
        <div className="space-y-0.5">
          {recommendedBooks.map((book, index) => (
            <RecommendedBookListItem
              key={`${book.workKey}-${index}`}
              book={book}
              onBookSelect={onBookSelect}
            />
          ))}
        </div>
      </ScrollArea>
    </section>
  );
};

export default RecommendedBooksSection;
