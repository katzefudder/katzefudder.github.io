FROM ubuntu:18.04
LABEL maintainer="flo@katzefudder.de"

# Install Basics
RUN apt-get update && apt-get install -y curl ruby ruby-dev build-essential \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

RUN echo '# Install Ruby Gems to ~/gems' >> ~/.bashrc \
  echo 'export GEM_HOME=$HOME/gems' >> ~/.bashrc \
  echo 'export PATH=$HOME/gems/bin:$PATH' >> ~/.bashrc \
  source ~/.bashrc

# Install NodeJS
RUN curl -sL https://deb.nodesource.com/setup_12.x | bash -
RUN apt-get install -yq nodejs build-essential

# Fix npm - not the latest version installed by apt-get
RUN npm install -g npm \
  && npm install -g gh

RUN npm install -g gulp-cli && npm install gulp gulp-sass gulp-header del gulp-compress gulp-clean-css gulp-rename gulp-minify gulp-minify-css gulp-concat-css gulp-concat browser-sync gulp-inject

VOLUME /src
EXPOSE 4000

# Grunt logs to stdout
RUN ln -sf /dev/stdout /var/log/gulp.log

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

WORKDIR /src

#RUN ln -sf /dev/stdout /var/log/nginx/access.log && ln -sf /dev/stderr /var/log/nginx/error.log

ENTRYPOINT ["/entrypoint.sh"]
CMD ["bash"]
