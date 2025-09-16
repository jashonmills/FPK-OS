import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, User, TreePine } from 'lucide-react';
import MediaPlayer from '@/components/course/MediaPlayer';

export const EnergyBearLesson: React.FC = () => {
  return (
    <div className="space-y-6">
      <MediaPlayer
        src="https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/learning-state-course/Module-3-Learning%20State/Module%203%20-%20The%20Energy%20Bear.mp4"
        type="video"
        title="Your Energy Bear"
        mediaId="energy-bear-video"
        courseId="empowering-learning-state"
        moduleId="4"
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Heart className="h-6 w-6 text-primary" />
            Your Energy Bear
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-gray max-w-none space-y-4">
            <p>The Energy Bear is a great little activity that Anne Smith, an Empowering Learning Practitioner, created. For any child, having an Energy Bear allows them to get grounded and regulate their own energy. If you or your child have a cuddly bear, why not make it your very own Energy Bear and read through the text below to help you get grounded.</p>
          </div>
          
          <Card className="mt-6 bg-amber-50 border-amber-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-amber-900">
                <Heart className="h-5 w-5" />
                Your Energy Bear Poem
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-amber-800 font-medium leading-relaxed">
                <p>Don't have your feet<br/>
                Right up in the air<br/>
                Instead plant your feet<br/>
                Down firm on the floor<br/>
                Then you can be grounded like your energy bear</p>

                <p>After all<br/>
                Did you ever see a bear with all his feet in the air?<br/>
                No – well not often!</p>

                <p>For bears have four feet they refer to as paws<br/>
                With big furry pads and fingers like claws<br/>
                Good for gripping fast to the ground<br/>
                That's what helps these bears get around.</p>

                <p>And bears are very grounded<br/>
                Because bears are very rounded<br/>
                And they like a lots of laughs<br/>
                Even more than giraffes</p>

                <p>So be like the bears<br/>
                And let go of your cares<br/>
                That might not be easy<br/>
                To do on your own<br/>
                So that's why you invite<br/>
                An Energy Bear home</p>

                <p>Now when you have worries<br/>
                Problems or cares,<br/>
                You give all your troubles<br/>
                To the Energy Bears</p>

                <p>What these bears love best<br/>
                Is to help you feel good<br/>
                Just like when you rest<br/>
                Or are eating some food</p>

                <p>Let the bears take your cares<br/>
                Sink them deep in the ground<br/>
                Then they become clear<br/>
                For the next time around</p>

                <p>So now when we have a few worries or fears<br/>
                With Energy Bears there's less need for tears<br/>
                Bears take our worries and cares and concerns<br/>
                And sort them all out with the help of the ground<br/>
                It's a gift that they've learned</p>

                <p>And it can be yours if you ask<br/>
                So ask them right now<br/>
                For help with this task</p>

                <p>Bears can take all your worries<br/>
                Plant them firm in the ground<br/>
                Let the earth do its magic<br/>
                Then you feel safe and sound</p>

                <p>Now remember together<br/>
                Feet firm on the ground<br/>
                Fill up with energy<br/>
                And look what you've found</p>

                <p>Your body feels calmer<br/>
                The pictures slow down<br/>
                Thinking is easier<br/>
                And now you have found</p>

                <p>The secret to slowing<br/>
                E v e r y t h i n g  d o w n.</p>

                <p>So remember to share<br/>
                All your cares with your bear<br/>
                That's why they are here<br/>
                So keep yours quite near</p>

                <p>Because bears are so friendly<br/>
                So eager to please<br/>
                And show you the magic<br/>
                Of grounding with ease</p>

                <p className="text-sm italic mt-4">
                  Written by Anne Smith<br/>
                  anne@touchstone-coaching.com<br/>
                  An Empowering Learning Practitioner<br/>
                  www.empoweringlearning.co.uk
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-6 bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TreePine className="h-5 w-5 text-green-600" />
                Practice Tip
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Find a cuddly bear (or imagine one) and make it your Energy Bear. Whenever you feel worried or overwhelmed, give all your troubles to your Energy Bear and let them help you feel grounded and calm.
              </p>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};